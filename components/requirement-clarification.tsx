'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2, Lightbulb, Users, Sparkles } from 'lucide-react'
import { analyzeRequirement, generateUserStories } from '@/lib/openrouter'
import type { RequirementAnalysis, UserStory, ConfidenceLevel } from '@/types/workspace'

interface RequirementClarificationProps {
  description: string
  onComplete?: (userStories: string[]) => void
}

export function RequirementClarification({ description, onComplete }: RequirementClarificationProps) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<RequirementAnalysis | null>(null)
  const [userStories, setUserStories] = useState<UserStory[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  // 分析需求
  const handleAnalyze = async () => {
    if (!description.trim()) return

    setLoading(true)
    try {
      const result = await analyzeRequirement(description)
      setAnalysis(result.analysis)

      // 默认选中高置信度的项
      const highConfidenceRoles = result.analysis.roles
        .filter((r: any) => r.confidence === 'high')
        .map((r: any) => r.name)
      const highConfidenceFeatures = result.analysis.features
        .filter((f: any) => f.confidence === 'high')
        .map((f: any) => f.name)

      setSelectedRoles(highConfidenceRoles)
      setSelectedFeatures(highConfidenceFeatures)
    } catch (error) {
      console.error('Analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 生成用户故事
  const handleGenerateStories = async () => {
    if (selectedRoles.length === 0 || selectedFeatures.length === 0) return

    setLoading(true)
    try {
      const result = await generateUserStories(selectedRoles, selectedFeatures)
      setUserStories(result.stories)

      if (onComplete) {
        onComplete(result.formatted)
      }
    } catch (error) {
      console.error('Story generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 切换选中状态
  const toggleRole = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    )
  }

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureName)
        ? prev.filter(f => f !== featureName)
        : [...prev, featureName]
    )
  }

  // 置信度颜色
  const getConfidenceBadgeVariant = (confidence: ConfidenceLevel): "default" | "secondary" | "outline" => {
    switch (confidence) {
      case 'high':
        return 'default'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          需求澄清
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis ? (
          <div className="text-center py-8">
            <Button onClick={handleAnalyze} disabled={loading || !description.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  开始需求分析
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              AI 将帮你分析需求中的关键角色和功能特性
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 角色列表 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4" />
                <h4 className="font-semibold text-sm">识别到的角色</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.roles.map((role) => (
                  <Badge
                    key={role.name}
                    variant={selectedRoles.includes(role.name) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleRole(role.name)}
                  >
                    {role.name}
                    <span className="ml-1 text-xs opacity-70">
                      ({role.confidence === 'high' ? '高' : role.confidence === 'medium' ? '中' : '低'})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 功能特性列表 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-semibold text-sm">识别到的功能特性</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.features.map((feature) => (
                  <Badge
                    key={feature.name}
                    variant={selectedFeatures.includes(feature.name) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleFeature(feature.name)}
                  >
                    {feature.name}
                    <span className="ml-1 text-xs opacity-70">
                      ({feature.confidence === 'high' ? '高' : feature.confidence === 'medium' ? '中' : '低'})
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 生成用户故事按钮 */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateStories}
                disabled={loading || selectedRoles.length === 0 || selectedFeatures.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成用户故事
                  </>
                )}
              </Button>
            </div>

            {/* 用户故事展示 */}
            {userStories.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-sm mb-3">生成的用户故事</h4>
                  <div className="space-y-2">
                    {userStories.map((story, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                        <span className="font-medium">作为</span> {story.role}，
                        <span className="font-medium">我想要</span> {story.feature}，
                        <span className="font-medium">以便</span> {story.value}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
