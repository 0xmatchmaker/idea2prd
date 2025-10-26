'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getOrCreateDefaultProject } from '@/lib/db/projects'
import { WorkspaceNavbar } from '@/components/workspace-navbar'
import { WorkspaceContainer } from '@/components/workspace-container'
import { Loader2 } from 'lucide-react'

function WorkspacePageContent() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')

  const [user, setUser] = useState<any>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState<string>('')
  const [loading, setLoading] = useState(true)

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
        setProjectName(project.name)
      } catch (error) {
        console.error('Init error:', error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!projectId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">项目加载失败，请刷新页面重试</p>
      </div>
    )
  }

  return (
    <>
      <WorkspaceNavbar />
      <WorkspaceContainer
        projectId={projectId}
        projectName={projectName}
        templateId={templateId || undefined}
      />
    </>
  )
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <WorkspacePageContent />
    </Suspense>
  )
}
