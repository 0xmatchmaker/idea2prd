'use client'

import { useLocale } from '@/components/locale-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, BookOpen, Map, ArrowRight, Check } from 'lucide-react'

export function ThreeStepFlow() {
  const { t } = useLocale()

  const steps = [
    {
      number: 1,
      icon: Lightbulb,
      title: t('flow.step1.title'),
      desc: t('flow.step1.desc'),
      example: t('flow.step1.example'),
      features: [
        t('flow.step1.feature1'),
        t('flow.step1.feature2'),
        t('flow.step1.feature3')
      ],
      color: 'from-yellow-500/20 to-yellow-600/20',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
      bgColor: 'bg-yellow-50'
    },
    {
      number: 2,
      icon: BookOpen,
      title: t('flow.step2.title'),
      desc: t('flow.step2.desc'),
      example: t('flow.step2.example'),
      features: [
        t('flow.step2.feature1'),
        t('flow.step2.feature2'),
        t('flow.step2.feature3')
      ],
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50'
    },
    {
      number: 3,
      icon: Map,
      title: t('flow.step3.title'),
      desc: t('flow.step3.desc'),
      example: t('flow.step3.example'),
      features: [
        t('flow.step3.feature1'),
        t('flow.step3.feature2'),
        t('flow.step3.feature3')
      ],
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Idea → Story → Blueprint
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>

        {/* 三步流程 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* 连接箭头 (桌面端) */}
          <div className="hidden md:block absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <div className="hidden md:block absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
            <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* 移动端箭头 */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30 rotate-90" />
                  </div>
                )}

                <Card className={`border-2 ${step.borderColor} hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6 space-y-4">
                    {/* 图标和标题 */}
                    <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-8 h-8 ${step.iconColor}`} />
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">
                        Step {step.number}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>

                    {/* 示例 */}
                    <div className={`p-3 rounded-lg ${step.bgColor} border ${step.borderColor}`}>
                      <p className="text-sm italic text-gray-700">
                        {step.example}
                      </p>
                    </div>

                    {/* 特点列表 */}
                    <div className="space-y-2 pt-2">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 mt-0.5 ${step.iconColor} flex-shrink-0`} />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* 底部 GO 说明 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full">
            <span className="text-sm font-medium">然后</span>
            <ArrowRight className="w-4 h-4" />
            <Badge variant="default" className="text-sm font-bold">📥 GO</Badge>
            <span className="text-sm">一键导出 n8n 工作流，开始执行</span>
          </div>
        </div>
      </div>
    </section>
  )
}
