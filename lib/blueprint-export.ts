import type { Blueprint, ExportConfig, N8nWorkflow } from '@/types/workspace'

/**
 * 将蓝图转换为标准 n8n 工作流格式
 */
export function blueprintToN8nWorkflow(
  blueprint: Blueprint,
  config: ExportConfig = { format: 'n8n' }
): N8nWorkflow {
  // 过滤节点（根据优先级）
  let nodes = blueprint.nodes
  if (config.priorityFilter && config.priorityFilter.length > 0) {
    nodes = nodes.filter(node =>
      node.priority && config.priorityFilter!.includes(node.priority)
    )
  }

  // 转换为标准 n8n 格式（移除扩展字段）
  const n8nNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    name: node.name,
    position: node.position,
    parameters: node.parameters,
    credentials: node.credentials
  }))

  // 处理连接（只保留存在的节点）
  const nodeIds = new Set(nodes.map(n => n.id))
  const connections: Record<string, { main: any[][] }> = {}

  for (const [fromId, outputs] of Object.entries(blueprint.connections || {})) {
    if (nodeIds.has(fromId)) {
      connections[fromId] = {
        main: outputs.main.map(mainOutputs =>
          mainOutputs.filter(conn => nodeIds.has(conn.node))
        ).filter(arr => arr.length > 0)
      }
    }
  }

  const workflow: N8nWorkflow = {
    nodes: n8nNodes,
    connections,
    settings: blueprint.settings
  }

  return workflow
}

/**
 * 导出为JSON文件（下载）
 */
export function exportBlueprint(
  blueprint: Blueprint,
  config: ExportConfig,
  fileName: string = 'blueprint'
) {
  let content: string
  let mimeType: string
  let ext: string

  switch (config.format) {
    case 'n8n':
      const workflow = blueprintToN8nWorkflow(blueprint, config)
      content = JSON.stringify(workflow, null, 2)
      mimeType = 'application/json'
      ext = 'json'
      break

    case 'json':
      content = JSON.stringify(blueprint, null, 2)
      mimeType = 'application/json'
      ext = 'json'
      break

    case 'markdown':
      content = blueprintToMarkdown(blueprint)
      mimeType = 'text/markdown'
      ext = 'md'
      break

    default:
      throw new Error(`Unsupported export format: ${config.format}`)
  }

  // 创建下载
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 将蓝图转换为 Markdown 文档
 */
function blueprintToMarkdown(blueprint: Blueprint): string {
  const lines: string[] = []

  lines.push('# 产品蓝图文档\n')

  // 统计信息
  const p0Count = blueprint.nodes.filter(n => n.priority === 'P0').length
  const p1Count = blueprint.nodes.filter(n => n.priority === 'P1').length
  const p2Count = blueprint.nodes.filter(n => n.priority === 'P2').length

  lines.push('## 概览\n')
  lines.push(`- 总节点数：${blueprint.nodes.length}`)
  lines.push(`- MVP功能（P0）：${p0Count} 个`)
  lines.push(`- 重要功能（P1）：${p1Count} 个`)
  lines.push(`- 增强功能（P2）：${p2Count} 个`)
  lines.push(`- 模块分组：${blueprint.groups?.length || 0} 个`)
  lines.push(`- 设计说明：${blueprint.stickyNotes?.length || 0} 条\n`)

  // 分组信息
  if (blueprint.groups && blueprint.groups.length > 0) {
    lines.push('## 模块分组\n')
    blueprint.groups.forEach(group => {
      lines.push(`### ${group.name}`)
      if (group.description) {
        lines.push(`> ${group.description}\n`)
      }
      const groupNodes = blueprint.nodes.filter(n => n.groupId === group.id)
      groupNodes.forEach(node => {
        lines.push(`- **${node.name}** (${node.priority || 'P3'})`)
        if (node.technicalNotes) {
          lines.push(`  - ${node.technicalNotes}`)
        }
      })
      lines.push('')
    })
  }

  // 按优先级列出所有节点
  lines.push('## 功能节点\n')

  const priorities: Array<{ level: string; label: string }> = [
    { level: 'P0', label: 'MVP 必需功能' },
    { level: 'P1', label: '重要功能' },
    { level: 'P2', label: '增强功能' },
    { level: 'P3', label: '未来规划' }
  ]

  priorities.forEach(({ level, label }) => {
    const nodes = blueprint.nodes.filter(n => n.priority === level)
    if (nodes.length > 0) {
      lines.push(`### ${label}\n`)
      nodes.forEach(node => {
        lines.push(`#### ${node.name}`)
        lines.push(`- **类型**：${node.type}`)
        if (node.technicalNotes) {
          lines.push(`- **技术说明**：${node.technicalNotes}`)
        }
        if (node.userStoryIds && node.userStoryIds.length > 0) {
          lines.push(`- **关联故事**：${node.userStoryIds.join(', ')}`)
        }
        lines.push('')
      })
    }
  })

  // 设计说明（便签）
  if (blueprint.stickyNotes && blueprint.stickyNotes.length > 0) {
    lines.push('## 设计说明\n')
    blueprint.stickyNotes.forEach((note, index) => {
      lines.push(`${index + 1}. ${note.content}`)
    })
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * 获取导出预览
 */
export function getExportPreview(
  blueprint: Blueprint,
  config: ExportConfig
): { nodeCount: number; summary: string } {
  const workflow = config.format === 'n8n'
    ? blueprintToN8nWorkflow(blueprint, config)
    : blueprint

  const nodeCount = workflow.nodes.length
  const priorityFilter = config.priorityFilter?.join(', ') || '全部'

  const summary = config.format === 'n8n'
    ? `将导出 ${nodeCount} 个节点的 n8n 工作流（优先级：${priorityFilter}）`
    : config.format === 'markdown'
      ? `将生成包含 ${nodeCount} 个节点的 Markdown 文档`
      : `将导出完整蓝图 JSON（${nodeCount} 个节点）`

  return { nodeCount, summary }
}
