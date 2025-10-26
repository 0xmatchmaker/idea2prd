'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Link as LinkIcon } from 'lucide-react'
import type { UserStory, BlueprintNode } from '@/types/workspace'

interface UserStoryBoardProps {
  stories: UserStory[]
  onStoryClick?: (story: UserStory, index: number) => void
  selectedStoryIndex?: number
  blueprintNodes?: BlueprintNode[] // 用于显示关联关系
}

export function UserStoryBoard({
  stories,
  onStoryClick,
  selectedStoryIndex,
  blueprintNodes = []
}: UserStoryBoardProps) {
  // 检查故事是否关联到蓝图节点
  const getLinkedNodesCount = (storyIndex: number): number => {
    const storyId = `story-${storyIndex}`
    return blueprintNodes.filter(node =>
      node.userStoryIds?.includes(storyId)
    ).length
  }

  if (stories.length === 0) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">暂无用户故事</p>
          <p className="text-sm text-muted-foreground mt-2">
            请先在需求澄清中生成用户故事
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            用户故事看板
          </div>
          <Badge variant="outline">{stories.length} 个故事</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 pb-6">
          <div className="space-y-3">
            {stories.map((story, index) => {
              const linkedNodesCount = getLinkedNodesCount(index)
              const isSelected = selectedStoryIndex === index

              return (
                <div
                  key={index}
                  onClick={() => onStoryClick?.(story, index)}
                  className={`
                    p-4 rounded-lg border-2 transition-all cursor-pointer
                    ${isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    {linkedNodesCount > 0 && (
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        {linkedNodesCount} 个节点
                      </Badge>
                    )}
                  </div>

                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold text-primary">作为</span>
                      <span className="ml-1">{story.role}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">我想要</span>
                      <span className="ml-1">{story.feature}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">以便</span>
                      <span className="ml-1">{story.value}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
