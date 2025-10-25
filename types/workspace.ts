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
