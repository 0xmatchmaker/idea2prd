'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Download, FileJson, FileCode, FileText } from 'lucide-react'
import { exportBlueprint, getExportPreview } from '@/lib/blueprint-export'
import type { Blueprint, ExportConfig, PriorityLevel } from '@/types/workspace'

interface ExportDialogProps {
  blueprint: Blueprint
  projectName?: string
  children?: React.ReactNode
}

export function ExportDialog({ blueprint, projectName = 'blueprint', children }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<ExportConfig>({
    format: 'n8n',
    includeNotes: true,
    includeGroups: true,
    priorityFilter: []
  })

  const preview = getExportPreview(blueprint, config)

  const handleExport = () => {
    exportBlueprint(blueprint, config, projectName)
    setOpen(false)
  }

  const togglePriority = (priority: PriorityLevel) => {
    setConfig(prev => ({
      ...prev,
      priorityFilter: prev.priorityFilter?.includes(priority)
        ? prev.priorityFilter.filter(p => p !== priority)
        : [...(prev.priorityFilter || []), priority]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" className="gap-2">
            <Download className="w-4 h-4" />
            GO 导出
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            导出产品蓝图
          </DialogTitle>
          <DialogDescription>
            选择导出格式和配置，生成可执行的工作流文件
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 导出格式 */}
          <div className="space-y-3">
            <Label>导出格式</Label>
            <RadioGroup
              value={config.format}
              onValueChange={(value) => setConfig({ ...config, format: value as any })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="n8n" id="n8n" />
                <Label htmlFor="n8n" className="flex items-center gap-2 cursor-pointer">
                  <FileCode className="w-4 h-4" />
                  n8n 工作流（可直接导入n8n）
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="w-4 h-4" />
                  完整蓝图 JSON
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="markdown" id="markdown" />
                <Label htmlFor="markdown" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Markdown 文档
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 优先级过滤 */}
          <div className="space-y-3">
            <Label>优先级过滤（可多选）</Label>
            <div className="space-y-2">
              {(['P0', 'P1', 'P2', 'P3'] as PriorityLevel[]).map(priority => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={priority}
                    checked={config.priorityFilter?.includes(priority)}
                    onCheckedChange={() => togglePriority(priority)}
                  />
                  <Label htmlFor={priority} className="cursor-pointer text-sm">
                    {priority} - {priority === 'P0' ? 'MVP' : priority === 'P1' ? '重要' : priority === 'P2' ? '增强' : '未来'}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              不选择时导出全部优先级
            </p>
          </div>

          {/* 预览 */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-1">导出预览</p>
            <p className="text-xs text-muted-foreground">{preview.summary}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            导出
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
