'use client'

import { useState, useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StickyNote as StickyNoteIcon, Layers, Tag } from 'lucide-react'
import type { Blueprint, BlueprintNode, StickyNote, PriorityLevel, NodeGroup } from '@/types/workspace'

// 优先级颜色映射
const priorityColors: Record<PriorityLevel, { bg: string; border: string; text: string }> = {
  P0: { bg: '#d1fae5', border: '#10b981', text: 'MVP' },
  P1: { bg: '#fef3c7', border: '#f59e0b', text: '重要' },
  P2: { bg: '#dbeafe', border: '#3b82f6', text: '增强' },
  P3: { bg: '#f3f4f6', border: '#9ca3af', text: '未来' }
}

// 自定义蓝图节点组件
function BlueprintNodeComponent({ data, selected }: NodeProps) {
  const node = data.node as BlueprintNode
  const priority = node.priority || 'P3'
  const colors = priorityColors[priority]

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 2,
        borderStyle: 'solid',
        padding: 12,
        borderRadius: 8,
        minWidth: 180,
        boxShadow: selected ? '0 0 0 2px #3b82f6' : 'none'
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div className="space-y-2">
        {/* 优先级标签 */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {colors.text}
          </Badge>
          {node.userStoryIds && node.userStoryIds.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {node.userStoryIds.length} 故事
            </Badge>
          )}
        </div>

        {/* 节点名称 */}
        <div className="font-semibold text-sm">{data.label}</div>

        {/* 技术说明 */}
        {node.technicalNotes && (
          <div className="text-xs text-muted-foreground line-clamp-2">
            {node.technicalNotes}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

// 自定义便签组件
function StickyNoteNode({ data }: NodeProps) {
  const note = data.note as StickyNote

  return (
    <div
      style={{
        backgroundColor: note.color || '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: 4,
        padding: 12,
        minWidth: 200,
        maxWidth: 300,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <StickyNoteIcon className="w-4 h-4 text-yellow-700" />
        <span className="text-xs font-semibold text-yellow-700">便签</span>
      </div>
      <div className="text-sm whitespace-pre-wrap">{note.content}</div>
    </div>
  )
}

const nodeTypes = {
  blueprint: BlueprintNodeComponent,
  stickyNote: StickyNoteNode
}

interface BlueprintEditorProps {
  blueprint: Blueprint
  onBlueprintChange?: (blueprint: Blueprint) => void
  highlightedStoryIndex?: number // 高亮显示的用户故事索引
  selectedNodeId?: string
  onNodeSelect?: (nodeId: string | undefined) => void
}

export function BlueprintEditor({
  blueprint,
  onBlueprintChange,
  highlightedStoryIndex,
  selectedNodeId,
  onNodeSelect
}: BlueprintEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [editingNode, setEditingNode] = useState<BlueprintNode | null>(null)

  // 转换蓝图为 ReactFlow 格式
  useMemo(() => {
    const flowNodes: Node[] = []
    const storyId = highlightedStoryIndex !== undefined ? `story-${highlightedStoryIndex}` : null

    // 添加蓝图节点
    blueprint.nodes.forEach(node => {
      const isHighlighted = storyId && node.userStoryIds?.includes(storyId)

      flowNodes.push({
        id: node.id,
        type: 'blueprint',
        data: {
          label: node.name || node.type,
          node
        },
        position: { x: node.position[0], y: node.position[1] },
        style: {
          opacity: isHighlighted ? 1 : (highlightedStoryIndex !== undefined ? 0.3 : 1)
        }
      })
    })

    // 添加便签
    blueprint.stickyNotes?.forEach(note => {
      flowNodes.push({
        id: note.id,
        type: 'stickyNote',
        data: { note },
        position: { x: note.position[0], y: note.position[1] },
        draggable: true
      })
    })

    setNodes(flowNodes)

    // 设置连接线
    const flowEdges: Edge[] = []
    for (const [fromId, outputs] of Object.entries(blueprint.connections || {})) {
      if (outputs.main) {
        for (const mainOutputs of outputs.main) {
          for (const conn of mainOutputs) {
            flowEdges.push({
              id: `${fromId}-${conn.node}`,
              source: fromId,
              target: conn.node,
              animated: true
            })
          }
        }
      }
    }
    setEdges(flowEdges)
  }, [blueprint, highlightedStoryIndex, setNodes, setEdges])

  // 节点点击事件
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'blueprint') {
      const blueprintNode = node.data.node as BlueprintNode
      setEditingNode(blueprintNode)
      onNodeSelect?.(node.id)
    }
  }, [onNodeSelect])

  // 更新节点信息
  const updateNode = useCallback((updates: Partial<BlueprintNode>) => {
    if (!editingNode) return

    const updatedBlueprint = {
      ...blueprint,
      nodes: blueprint.nodes.map(node =>
        node.id === editingNode.id ? { ...node, ...updates } : node
      )
    }

    onBlueprintChange?.(updatedBlueprint)
    setEditingNode({ ...editingNode, ...updates })
  }, [editingNode, blueprint, onBlueprintChange])

  return (
    <div className="flex gap-4 h-full">
      {/* 蓝图画布 */}
      <div className="flex-1 relative bg-gray-50 rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={2}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* 图例 */}
        <div className="absolute bottom-4 right-4 bg-white border rounded-lg shadow-lg p-3 space-y-2 z-10">
          <div className="text-xs font-semibold text-gray-700 mb-2">优先级图例</div>
          {Object.entries(priorityColors).map(([priority, colors]) => (
            <div key={priority} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`
                }}
              />
              <span>{colors.text} ({priority})</span>
            </div>
          ))}
        </div>
      </div>

      {/* 节点编辑面板 */}
      {editingNode && (
        <Card className="w-80 p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">节点属性</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingNode(null)}
            >
              ✕
            </Button>
          </div>

          <div className="space-y-3">
            {/* 节点名称 */}
            <div>
              <Label className="text-xs">名称</Label>
              <div className="mt-1 text-sm font-medium">{editingNode.name}</div>
            </div>

            {/* 优先级选择 */}
            <div>
              <Label className="text-xs flex items-center gap-1">
                <Tag className="w-3 h-3" />
                优先级
              </Label>
              <Select
                value={editingNode.priority || 'P3'}
                onValueChange={(value) => updateNode({ priority: value as PriorityLevel })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P0">P0 - MVP</SelectItem>
                  <SelectItem value="P1">P1 - 重要</SelectItem>
                  <SelectItem value="P2">P2 - 增强</SelectItem>
                  <SelectItem value="P3">P3 - 未来</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 技术说明 */}
            <div>
              <Label className="text-xs">技术说明</Label>
              <Textarea
                className="mt-1 text-xs"
                placeholder="添加技术细节、API端点、数据结构等..."
                value={editingNode.technicalNotes || ''}
                onChange={(e) => updateNode({ technicalNotes: e.target.value })}
                rows={4}
              />
            </div>

            {/* 关联的用户故事 */}
            {editingNode.userStoryIds && editingNode.userStoryIds.length > 0 && (
              <div>
                <Label className="text-xs">关联的用户故事</Label>
                <div className="mt-1 space-y-1">
                  {editingNode.userStoryIds.map(storyId => (
                    <Badge key={storyId} variant="outline" className="text-xs">
                      {storyId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
