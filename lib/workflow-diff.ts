import { create } from 'jsondiffpatch'
import type { N8nWorkflow, N8nNode, WorkflowDiff } from '@/types/workspace'

const differ = create({
  objectHash: function(obj: any) {
    return obj.id || obj._id || obj.name
  }
})

/**
 * 对比两个 n8n 工作流，返回差异
 */
export function compareWorkflows(
  oldWorkflow: N8nWorkflow | null,
  newWorkflow: N8nWorkflow
): WorkflowDiff {
  if (!oldWorkflow) {
    // 如果没有旧版本，所有节点都是新增的
    return {
      addedNodes: newWorkflow.nodes,
      modifiedNodes: [],
      deletedNodes: [],
      addedConnections: extractAllConnections(newWorkflow),
      deletedConnections: []
    }
  }

  // 创建节点 ID 到节点的映射
  const oldNodesMap = new Map(oldWorkflow.nodes.map(n => [n.id, n]))
  const newNodesMap = new Map(newWorkflow.nodes.map(n => [n.id, n]))

  const addedNodes: N8nNode[] = []
  const modifiedNodes: N8nNode[] = []
  const deletedNodes: N8nNode[] = []

  // 检测新增和修改的节点
  for (const newNode of newWorkflow.nodes) {
    const oldNode = oldNodesMap.get(newNode.id)

    if (!oldNode) {
      // 新增节点
      addedNodes.push(newNode)
    } else {
      // 检查是否修改
      const delta = differ.diff(oldNode, newNode)
      if (delta) {
        modifiedNodes.push(newNode)
      }
    }
  }

  // 检测删除的节点
  for (const oldNode of oldWorkflow.nodes) {
    if (!newNodesMap.has(oldNode.id)) {
      deletedNodes.push(oldNode)
    }
  }

  // 对比连接
  const oldConnections = extractAllConnections(oldWorkflow)
  const newConnections = extractAllConnections(newWorkflow)

  const addedConnections = newConnections.filter(
    newConn => !oldConnections.some(
      oldConn => oldConn.from === newConn.from && oldConn.to === newConn.to
    )
  )

  const deletedConnections = oldConnections.filter(
    oldConn => !newConnections.some(
      newConn => newConn.from === oldConn.from && newConn.to === oldConn.to
    )
  )

  return {
    addedNodes,
    modifiedNodes,
    deletedNodes,
    addedConnections,
    deletedConnections
  }
}

/**
 * 从工作流中提取所有连接
 */
function extractAllConnections(workflow: N8nWorkflow): Array<{ from: string; to: string }> {
  const connections: Array<{ from: string; to: string }> = []

  for (const [fromNodeId, outputs] of Object.entries(workflow.connections || {})) {
    if (outputs.main) {
      for (const mainOutputs of outputs.main) {
        for (const connection of mainOutputs) {
          connections.push({
            from: fromNodeId,
            to: connection.node
          })
        }
      }
    }
  }

  return connections
}

/**
 * 计算工作流的简单统计信息
 */
export function calculateWorkflowStats(workflow: N8nWorkflow) {
  const nodeCount = workflow.nodes.length
  const connectionCount = extractAllConnections(workflow).length

  // 统计节点类型
  const nodeTypes = workflow.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    nodeCount,
    connectionCount,
    nodeTypes,
    complexity: calculateComplexity(nodeCount, connectionCount)
  }
}

/**
 * 计算工作流复杂度（简单算法）
 */
function calculateComplexity(nodeCount: number, connectionCount: number): number {
  // 简单的复杂度评分：节点数 + 连接数 * 1.5
  return Math.round(nodeCount + connectionCount * 1.5)
}

/**
 * 生成diff摘要文本
 */
export function generateDiffSummary(diff: WorkflowDiff): string {
  const parts: string[] = []

  if (diff.addedNodes.length > 0) {
    parts.push(`+${diff.addedNodes.length} 新增节点`)
  }

  if (diff.modifiedNodes.length > 0) {
    parts.push(`~${diff.modifiedNodes.length} 修改节点`)
  }

  if (diff.deletedNodes.length > 0) {
    parts.push(`-${diff.deletedNodes.length} 删除节点`)
  }

  return parts.length > 0 ? parts.join(', ') : '无变化'
}
