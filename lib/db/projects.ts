import { createClient } from '../supabase'
import type { Project } from '@/types/workspace'

/**
 * 获取或创建用户的默认项目
 */
export async function getOrCreateDefaultProject(userId: string): Promise<Project> {
  const supabase = createClient()

  // 查找用户的第一个项目
  const { data: existing, error: fetchError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (existing && !fetchError) {
    return existing
  }

  // 如果没有项目，创建默认项目
  const { data: newProject, error: createError } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name: 'My Workflow Project',
      description: 'Auto-created workflow project'
    })
    .select()
    .single()

  if (createError) {
    throw new Error(`Failed to create project: ${createError.message}`)
  }

  return newProject
}

/**
 * 获取用户的所有项目
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return data || []
}

/**
 * 创建新项目
 */
export async function createProject(
  userId: string,
  name: string,
  description?: string
): Promise<Project> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name,
      description
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return data
}

/**
 * 更新项目信息
 */
export async function updateProject(
  projectId: string,
  updates: { name?: string; description?: string }
): Promise<Project> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`)
  }

  return data
}

/**
 * 删除项目（会级联删除所有版本）
 */
export async function deleteProject(projectId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`)
  }
}
