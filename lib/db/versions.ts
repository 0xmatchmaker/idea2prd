import { createClient } from '../supabase'
import type { WorkflowVersion, N8nWorkflow } from '@/types/workspace'
import { calculateWorkflowStats } from '../workflow-diff'

/**
 * 保存新版本
 */
export async function saveVersion(
  projectId: string,
  workflow: N8nWorkflow,
  description?: string,
  images: string[] = []
): Promise<WorkflowVersion> {
  const supabase = createClient()

  // 获取当前最大版本号
  const { data: versions } = await supabase
    .from('workflow_versions')
    .select('version_number')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false })
    .limit(1)

  const nextVersion = (versions?.[0]?.version_number || 0) + 1

  // 计算统计信息
  const stats = calculateWorkflowStats(workflow)

  const { data, error } = await supabase
    .from('workflow_versions')
    .insert({
      project_id: projectId,
      version_number: nextVersion,
      workflow_json: workflow,
      description,
      node_count: stats.nodeCount,
      connection_count: stats.connectionCount,
      images
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save version: ${error.message}`)
  }

  return data
}

/**
 * 获取项目的所有版本
 */
export async function getVersions(projectId: string): Promise<WorkflowVersion[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('workflow_versions')
    .select('*')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch versions: ${error.message}`)
  }

  return data || []
}

/**
 * 获取单个版本
 */
export async function getVersion(versionId: string): Promise<WorkflowVersion> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('workflow_versions')
    .select('*')
    .eq('id', versionId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch version: ${error.message}`)
  }

  return data
}

/**
 * 获取最新版本
 */
export async function getLatestVersion(projectId: string): Promise<WorkflowVersion | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('workflow_versions')
    .select('*')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found
      return null
    }
    throw new Error(`Failed to fetch latest version: ${error.message}`)
  }

  return data
}

/**
 * 删除版本
 */
export async function deleteVersion(versionId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('workflow_versions')
    .delete()
    .eq('id', versionId)

  if (error) {
    throw new Error(`Failed to delete version: ${error.message}`)
  }
}

/**
 * 更新版本（添加图片等）
 */
export async function updateVersion(
  versionId: string,
  updates: {
    description?: string
    images?: string[]
  }
): Promise<WorkflowVersion> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('workflow_versions')
    .update(updates)
    .eq('id', versionId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update version: ${error.message}`)
  }

  return data
}
