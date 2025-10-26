'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Save, Image as ImageIcon, MessageSquare, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { generateWorkflow, chatWithAI, generateSceneImage } from '@/lib/openrouter'
import { getOrCreateDefaultProject } from '@/lib/db/projects'
import { saveVersion, getVersions, getLatestVersion } from '@/lib/db/versions'
import { compareWorkflows, generateDiffSummary } from '@/lib/workflow-diff'
import { createClient } from '@/lib/supabase'
import type { N8nWorkflow, WorkflowVersion, WorkflowDiff } from '@/types/workspace'
import { WorkspaceNavbar } from '@/components/workspace-navbar'
import { RequirementClarification } from '@/components/requirement-clarification'

// 将 n8n 工作流转换为 React Flow 节点和边
function workflowToReactFlow(workflow: N8nWorkflow, diff?: WorkflowDiff, showDeletedNodes?: boolean) {
  const nodes: Node[] = []

  // 渲染当前工作流中的节点
  workflow.nodes.forEach(node => {
    // 判断节点状态
    let backgroundColor = '#fff'
    let borderColor = '#ddd'
    let label = node.name || node.type

    if (diff) {
      if (diff.addedNodes.find(n => n.id === node.id)) {
        backgroundColor = '#d1fae5' // 绿色 - 新增
        borderColor = '#10b981'
        label = `🟢 ${label}`
      } else if (diff.modifiedNodes.find(n => n.id === node.id)) {
        backgroundColor = '#fef3c7' // 黄色 - 修改
        borderColor = '#f59e0b'
        label = `🟡 ${label}`
      }
    }

    nodes.push({
      id: node.id,
      type: 'default',
      data: { label },
      position: { x: node.position[0], y: node.position[1] },
      style: {
        backgroundColor,
        borderColor,
        borderWidth: 2,
        padding: 10,
        borderRadius: 8,
        fontSize: 12
      }
    })
  })

  // 如果需要显示删除的节点
  if (diff && showDeletedNodes && diff.deletedNodes.length > 0) {
    diff.deletedNodes.forEach((node, index) => {
      nodes.push({
        id: `deleted-${node.id}`,
        type: 'default',
        data: { label: `🔴 ${node.name || node.type} (已删除)` },
        position: { x: node.position[0], y: node.position[1] + 100 }, // 偏移显示
        style: {
          backgroundColor: '#fee2e2', // 红色 - 删除
          borderColor: '#ef4444',
          borderWidth: 2,
          borderStyle: 'dashed',
          padding: 10,
          borderRadius: 8,
          fontSize: 12,
          opacity: 0.7
        }
      })
    })
  }

  const edges: Edge[] = []
  for (const [fromId, outputs] of Object.entries(workflow.connections || {})) {
    if (outputs.main) {
      for (const mainOutputs of outputs.main) {
        for (const conn of mainOutputs) {
          edges.push({
            id: `${fromId}-${conn.node}`,
            source: fromId,
            target: conn.node,
            animated: true
          })
        }
      }
    }
  }

  return { nodes, edges }
}

export default function WorkspacePage() {
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [projectId, setProjectId] = useState<string | null>(null)

  // 需求流程图状态
  const [currentWorkflow, setCurrentWorkflow] = useState<N8nWorkflow | null>(null)
  const [versions, setVersions] = useState<WorkflowVersion[]>([])
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null)
  const [diff, setDiff] = useState<WorkflowDiff | null>(null)
  const [compareNote, setCompareNote] = useState<string>('')

  // UI 状态
  const [description, setDescription] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // React Flow 状态
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // 初始化用户和项目
  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // 重定向到登录页
        window.location.href = '/login'
        return
      }

      setUser(user)

      try {
        const project = await getOrCreateDefaultProject(user.id)
        setProjectId(project.id)

        // 加载版本历史
        const versionsList = await getVersions(project.id)
        setVersions(versionsList)

        // 加载最新版本
        if (versionsList.length > 0) {
          const latest = versionsList[0]
          setCurrentWorkflow(latest.workflow_json)
          setSelectedVersionId(latest.id)
          const { nodes: flowNodes, edges: flowEdges } = workflowToReactFlow(latest.workflow_json)
          setNodes(flowNodes)
          setEdges(flowEdges)
        }
      } catch (error) {
        console.error('Init error:', error)
        toast({
          title: '初始化失败',
          description: String(error),
          variant: 'destructive'
        })
      }
    }

    init()
  }, [])

  // 当选择的版本变化时，更新 currentWorkflow（仅在非对比模式下）
  useEffect(() => {
    if (!selectedVersionId || compareVersionId) {
      return
    }

    const selectedVersion = versions.find(v => v.id === selectedVersionId)
    if (selectedVersion) {
      setCurrentWorkflow(selectedVersion.workflow_json)
      const { nodes: flowNodes, edges: flowEdges } = workflowToReactFlow(selectedVersion.workflow_json)
      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [selectedVersionId, versions, compareVersionId])

  // 生成需求流程图
  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      toast({ title: '请输入需求描述', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const result = await generateWorkflow(description)

      // 为节点添加唯一 ID 前缀，避免不同版本的 ID 冲突
      const timestamp = Date.now()
      const workflowWithUniqueIds = {
        ...result.workflow,
        nodes: result.workflow.nodes.map((node, index) => ({
          ...node,
          id: `${timestamp}-${node.id || `node-${index}`}`
        })),
        connections: Object.entries(result.workflow.connections || {}).reduce((acc, [fromId, outputs]) => {
          const newFromId = `${timestamp}-${fromId}`
          acc[newFromId] = {
            main: outputs.main.map(mainOutputs =>
              mainOutputs.map(conn => ({
                ...conn,
                node: `${timestamp}-${conn.node}`
              }))
            )
          }
          return acc
        }, {} as any)
      }

      setCurrentWorkflow(workflowWithUniqueIds)

      const { nodes: flowNodes, edges: flowEdges } = workflowToReactFlow(workflowWithUniqueIds)
      setNodes(flowNodes)
      setEdges(flowEdges)

      toast({
        title: '✨ 需求流程图生成成功',
        description: result.explanation
      })
    } catch (error) {
      toast({
        title: '生成失败',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [description])

  // 保存版本
  const handleSave = useCallback(async () => {
    if (!currentWorkflow || !projectId) return

    setLoading(true)
    try {
      const newVersion = await saveVersion(
        projectId,
        currentWorkflow,
        description || undefined,
        imageUrl ? [imageUrl] : []
      )

      setVersions(prev => [newVersion, ...prev])
      setSelectedVersionId(newVersion.id)

      toast({
        title: '💾 版本已保存',
        description: `版本 ${newVersion.version_number} 已保存`
      })
    } catch (error) {
      toast({
        title: '保存失败',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [currentWorkflow, projectId, description, imageUrl])

  // 版本对比
  useEffect(() => {
    if (!compareVersionId || compareVersionId === 'none' || !selectedVersionId) {
      setDiff(null)
      setCompareNote('')
      if (currentWorkflow) {
        const { nodes: flowNodes, edges: flowEdges } = workflowToReactFlow(currentWorkflow)
        setNodes(flowNodes)
        setEdges(flowEdges)
      }
      return
    }

    const version1 = versions.find(v => v.id === compareVersionId)
    const version2 = versions.find(v => v.id === selectedVersionId)

    if (version1 && version2) {
      // 自动判断新旧版本（按版本号排序）
      const isVersion1Older = version1.version_number < version2.version_number
      const oldVersion = isVersion1Older ? version1 : version2
      const newVersion = isVersion1Older ? version2 : version1

      // 执行对比
      const diffResult = compareWorkflows(oldVersion.workflow_json, newVersion.workflow_json)
      setDiff(diffResult)

      // 设置对比说明
      setCompareNote(
        `对比 v${oldVersion.version_number} → v${newVersion.version_number}：` +
        `🟢 新增 ${diffResult.addedNodes.length} 个节点，` +
        `🟡 修改 ${diffResult.modifiedNodes.length} 个节点，` +
        `🔴 删除 ${diffResult.deletedNodes.length} 个节点`
      )

      // 更新可视化，基于新版本显示，高亮差异，并显示删除的节点
      const { nodes: flowNodes, edges: flowEdges } = workflowToReactFlow(
        newVersion.workflow_json,
        diffResult,
        true // 显示删除的节点
      )
      setNodes(flowNodes)
      setEdges(flowEdges)
    }
  }, [compareVersionId, selectedVersionId, versions, currentWorkflow])

  // AI 对话
  const handleChat = useCallback(async () => {
    if (!chatMessage.trim()) return

    setLoading(true)
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }])

    try {
      const response = await chatWithAI(chatMessage, currentWorkflow || undefined)
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }])
      setChatMessage('')
    } catch (error) {
      toast({
        title: '对话失败',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [chatMessage, currentWorkflow])

  // 生成场景图
  const handleGenerateImage = useCallback(async () => {
    if (!currentWorkflow) {
      toast({ title: '请先生成需求流程图', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const prompt = description || `A workflow with ${currentWorkflow.nodes.length} steps`
      const result = await generateSceneImage(prompt)
      setImageUrl(result.url)

      toast({
        title: '🎨 场景图生成成功',
        description: '图片已生成'
      })
    } catch (error) {
      toast({
        title: '图片生成失败',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [currentWorkflow, description])

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <WorkspaceNavbar />

      {/* 工作区工具栏 */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">PRD 工作台</h1>
            <Badge variant="outline">
              {currentWorkflow?.nodes.length || 0} 节点
            </Badge>
            {compareNote && (
              <Badge variant="secondary" className="max-w-2xl">
                {compareNote}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedVersionId || ''} onValueChange={setSelectedVersionId}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择版本" />
              </SelectTrigger>
              <SelectContent>
                {versions.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    v{v.version_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={compareVersionId || 'none'} onValueChange={(value) => {
              setCompareVersionId(value === 'none' ? null : value)
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="对比版本" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无对比</SelectItem>
                {versions.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    v{v.version_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleSave} disabled={loading || !currentWorkflow}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>

            <Button onClick={handleGenerateImage} disabled={loading || !currentWorkflow} variant="outline">
              <ImageIcon className="w-4 h-4 mr-2" />
              生成图片
            </Button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：输入和对话 */}
        <div className="w-96 border-r p-4 flex flex-col gap-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI 需求分析
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="描述你的需求，例如：创建一个用户注册流程，包括邮箱验证、创建数据库记录、发送欢迎邮件..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成需求流程图
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Separator />

          <RequirementClarification
            description={description}
            onComplete={(stories) => {
              console.log('User stories generated:', stories)
              toast({
                title: '用户故事已生成',
                description: `生成了 ${stories.length} 个用户故事`
              })
            }}
          />

          <Separator />

          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI 助手
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3">
              <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px] max-h-[400px]">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="向 AI 提问..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleChat()
                    }
                  }}
                />
                <Button onClick={handleChat} disabled={loading}>
                  发送
                </Button>
              </div>
            </CardContent>
          </Card>

          {imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>场景图</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={imageUrl} alt="Workflow scene" className="w-full rounded" />
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧：需求流程图可视化 */}
        <div className="flex-1 bg-gray-50 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>

          {/* 图例说明 */}
          {diff && (
            <div className="absolute bottom-20 right-4 bg-white border rounded-lg shadow-lg p-3 space-y-2 z-10">
              <div className="text-xs font-semibold text-gray-700 mb-2">节点状态图例</div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 bg-green-200 border-2 border-green-500 rounded"></div>
                <span>🟢 新增节点</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-500 rounded"></div>
                <span>🟡 修改节点</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded border-dashed"></div>
                <span>🔴 删除节点</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                <span>⚪ 未变化</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
