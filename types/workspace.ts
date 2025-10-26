// n8n 工作流相关类型定义

export interface N8nNode {
  id: string
  type: string
  name: string
  position: [number, number]
  parameters: Record<string, any>
  credentials?: Record<string, any>
}

export interface N8nConnection {
  node: string
  type: string
  index: number
}

export interface N8nWorkflow {
  nodes: N8nNode[]
  connections: Record<string, { main: N8nConnection[][] }>
  settings?: Record<string, any>
}

export interface WorkflowVersion {
  id: string
  project_id: string
  version_number: number
  workflow_json: N8nWorkflow
  description?: string
  node_count: number
  connection_count: number
  images: string[]
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface WorkflowDiff {
  addedNodes: N8nNode[]
  modifiedNodes: N8nNode[]
  deletedNodes: N8nNode[]
  addedConnections: Array<{ from: string; to: string }>
  deletedConnections: Array<{ from: string; to: string }>
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface GenerateWorkflowRequest {
  description: string
  context?: string
}

export interface GenerateWorkflowResponse {
  workflow: N8nWorkflow
  explanation?: string
}

export interface GenerateImageRequest {
  prompt: string
  workflow?: N8nWorkflow
}

export interface GenerateImageResponse {
  url: string
  prompt: string
}

// 需求澄清相关类型
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export interface RequirementItem {
  name: string
  confidence: ConfidenceLevel
}

export interface RequirementAnalysis {
  roles: RequirementItem[]
  features: RequirementItem[]
}

export interface UserStory {
  role: string
  feature: string
  value: string
}

export interface AnalyzeRequirementResponse {
  analysis: RequirementAnalysis
  rawResponse?: string
}

export interface GenerateUserStoriesResponse {
  stories: UserStory[]
  formatted: string[]
}

// 蓝图相关类型定义
export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3' // P0=MVP, P1=重要, P2=增强, P3=未来
export type NodeGroupType = 'module' | 'phase' | 'layer' // 分组类型：模块/阶段/层级

export interface StickyNote {
  id: string
  content: string
  position: [number, number]
  size?: [number, number] // 宽高
  color?: string // 便签颜色
  createdAt?: string
}

export interface NodeGroup {
  id: string
  name: string
  type: NodeGroupType
  color: string
  nodeIds: string[] // 包含的节点ID列表
  description?: string
}

export interface BlueprintNode extends N8nNode {
  priority?: PriorityLevel
  groupId?: string // 所属分组
  userStoryIds?: string[] // 关联的用户故事ID
  technicalNotes?: string // 技术说明
  subWorkflowId?: string // 如果是子工作流的入口
}

export interface SubWorkflow {
  id: string
  name: string
  description?: string
  workflow: Blueprint
  parentNodeId: string // 父蓝图中的节点ID
}

export interface Blueprint {
  nodes: BlueprintNode[]
  connections: Record<string, { main: N8nConnection[][] }>
  stickyNotes?: StickyNote[]
  groups?: NodeGroup[]
  subWorkflows?: SubWorkflow[]
  settings?: Record<string, any>
}

export interface BlueprintVersion extends Omit<WorkflowVersion, 'workflow_json'> {
  blueprint_json: Blueprint
  user_stories?: UserStory[] // 关联的用户故事
}

// 用户故事看板相关
export interface StoryBoardColumn {
  id: string
  title: string
  stories: UserStory[]
}

// 导出配置
export interface ExportConfig {
  includeNotes?: boolean // 包含便签
  includeGroups?: boolean // 包含分组信息
  priorityFilter?: PriorityLevel[] // 只导出特定优先级
  format: 'n8n' | 'json' | 'markdown'
}
