'use client'

import { useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, BookOpen, Map } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { RequirementClarification } from './requirement-clarification'
import { UserStoryBoard } from './user-story-board'
import { BlueprintEditor } from './blueprint-editor'
import { ExportDialog } from './export-dialog'

import { generateBlueprint } from '@/lib/openrouter'
import type { Blueprint, UserStory } from '@/types/workspace'

interface WorkspaceContainerProps {
  projectId: string
  projectName?: string
}

export function WorkspaceContainer({ projectId, projectName }: WorkspaceContainerProps) {
  const { toast } = useToast()

  // 需求描述
  const [description, setDescription] = useState('')

  // 用户故事
  const [userStories, setUserStories] = useState<UserStory[]>([])
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | undefined>()

  // 蓝图
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined)

  // UI状态
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'stories' | 'blueprint'>('stories')

  // 当需求澄清完成，生成用户故事时
  const handleStoriesGenerated = useCallback((stories: UserStory[]) => {
    setUserStories(stories)
    toast({
      title: '用户故事已生成',
      description: `已生成 ${stories.length} 个用户故事`
    })
  }, [toast])

  // 生成蓝图
  const handleGenerateBlueprint = useCallback(async () => {
    if (!description.trim()) {
      toast({ title: '请先输入需求描述', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const result = await generateBlueprint(
        description,
        userStories.length > 0 ? userStories : undefined
      )

      setBlueprint(result.blueprint)
      setActiveTab('blueprint')

      toast({
        title: '产品蓝图已生成',
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
  }, [description, userStories, toast])

  // 处理故事点击（高亮蓝图中的节点）
  const handleStoryClick = useCallback((story: UserStory, index: number) => {
    setSelectedStoryIndex(index)
    setActiveTab('blueprint')
  }, [])

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部工具栏 */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">产品蓝图工作台</h1>
            {blueprint && (
              <Badge variant="outline">
                {blueprint.nodes.length} 节点 · {blueprint.groups?.length || 0} 分组
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {blueprint && (
              <ExportDialog
                blueprint={blueprint}
                projectName={projectName || 'product-blueprint'}
              />
            )}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：输入和需求澄清 */}
        <div className="w-96 border-r p-4 flex flex-col gap-4 overflow-y-auto">
          {/* 需求描述 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                需求描述
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="描述你的产品需求，例如：创建一个用户注册流程，包括邮箱验证、创建数据库记录、发送欢迎邮件..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
              <Button
                onClick={handleGenerateBlueprint}
                disabled={loading || !description.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Map className="w-4 h-4 mr-2" />
                    生成产品蓝图
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 需求澄清 */}
          <RequirementClarification
            description={description}
            onComplete={handleStoriesGenerated}
          />
        </div>

        {/* 右侧：双视图 */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
            <div className="border-b px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="stories" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  用户故事
                  {userStories.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {userStories.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="blueprint" className="gap-2">
                  <Map className="w-4 h-4" />
                  产品蓝图
                  {blueprint && (
                    <Badge variant="secondary" className="ml-1">
                      {blueprint.nodes.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="stories" className="flex-1 p-6 m-0">
              <UserStoryBoard
                stories={userStories}
                onStoryClick={handleStoryClick}
                selectedStoryIndex={selectedStoryIndex}
                blueprintNodes={blueprint?.nodes || []}
              />
            </TabsContent>

            <TabsContent value="blueprint" className="flex-1 p-6 m-0">
              {blueprint ? (
                <BlueprintEditor
                  blueprint={blueprint}
                  onBlueprintChange={setBlueprint}
                  highlightedStoryIndex={selectedStoryIndex}
                  selectedNodeId={selectedNodeId}
                  onNodeSelect={setSelectedNodeId}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">暂无产品蓝图</p>
                    <p className="text-sm text-muted-foreground">
                      请先输入需求描述并点击"生成产品蓝图"
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
