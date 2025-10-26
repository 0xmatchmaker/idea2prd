"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FAQPage() {
  const { t } = useLocale()

  const faqCategories = [
    {
      title: "产品功能",
      icon: "💡",
      questions: [
        {
          q: t("faq.q1"),
          a: t("faq.a1"),
        },
        {
          q: t("faq.q2"),
          a: t("faq.a2"),
        },
        {
          q: t("faq.q3"),
          a: t("faq.a3"),
        },
        {
          q: "Idea、Story、Blueprint 的区别是什么？",
          a: "Idea 是用自然语言描述的模糊想法；Story 是符合敏捷开发标准的用户故事，明确了角色、功能和价值；Blueprint 是可视化的产品蓝图，包含执行流程和优先级，可以导出给 AI 执行。",
        },
        {
          q: "可以导出哪些格式？",
          a: "免费版支持导出 Markdown 格式和带水印的基础可视化图；Pro 版支持无水印的 SVG、PNG 高清图片，以及可执行的 n8n 工作流文件。",
        },
      ],
    },
    {
      title: "定价与支付",
      icon: "💰",
      questions: [
        {
          q: "免费版和 Pro 版有什么区别？",
          a: "免费版提供本地保存、Markdown 导出和基础可视化（带水印）；Pro 版解锁云端保存、无水印导出、SVG/PNG 导出、分享链接、所有行业模板和 AI 需求澄清功能。",
        },
        {
          q: "支持哪些支付方式？",
          a: "我们通过 Creem 支付系统支持支付宝、微信支付、信用卡等多种支付方式，安全便捷。",
        },
        {
          q: "可以取消订阅吗？",
          a: "可以，您随时可以在账户设置中取消订阅。取消后将在当前计费周期结束后生效，已支付的费用不会退还。",
        },
        {
          q: "退款政策是什么？",
          a: "如果您在首次订阅后 7 天内不满意，可以申请全额退款，无需提供任何理由。请通过邮件联系我们的客服团队。",
        },
        {
          q: "可以随时升级或降级吗？",
          a: "可以，您可以随时升级到更高级别的计划，费用将按比例计算。降级将在当前计费周期结束后生效。",
        },
      ],
    },
    {
      title: "数据安全",
      icon: "🔒",
      questions: [
        {
          q: "我的数据存储在哪里？",
          a: "免费版数据存储在本地浏览器中；Pro 版和企业版数据加密存储在安全的云端服务器，支持多设备同步。",
        },
        {
          q: "会使用我的项目数据训练 AI 吗？",
          a: "绝对不会。我们承诺永远不会使用您的项目数据来训练任何 AI 模型。您的数据完全属于您自己，我们只是提供工具帮助您整理和可视化。",
        },
        {
          q: "如何删除我的数据？",
          a: "免费版可以直接在浏览器中清除本地存储；Pro 版和企业版可以在账户设置中选择删除所有项目数据，删除后无法恢复。",
        },
        {
          q: "数据传输是否加密？",
          a: "是的，所有数据传输都使用 HTTPS 加密协议，确保数据在传输过程中的安全性。",
        },
      ],
    },
    {
      title: "技术支持",
      icon: "🛠️",
      questions: [
        {
          q: "支持哪些浏览器？",
          a: "我们支持所有现代浏览器，包括 Chrome、Firefox、Safari 和 Edge 的最新版本。建议使用 Chrome 以获得最佳体验。",
        },
        {
          q: "可以离线使用吗？",
          a: "免费版支持离线使用，数据保存在本地；Pro 版需要联网以同步云端数据，但已加载的项目可以离线编辑。",
        },
        {
          q: "如何导出到 n8n？",
          a: "在 Blueprint 视图中，点击导出按钮选择 'n8n Workflow'，系统会生成可直接导入 n8n 的 JSON 文件，包含完整的节点和连接关系。",
        },
        {
          q: "遇到问题如何联系客服？",
          a: "您可以通过邮件 contact@ideaalchemy.com 联系我们，或在 GitHub 上提交 Issue。企业版用户享有专属客服通道。",
        },
        {
          q: "有 API 可以使用吗？",
          a: "API 访问权限仅对企业版用户开放。您可以使用 API 自动创建项目、生成蓝图、导出文件等。详细文档请联系我们获取。",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("faq.title")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          快速找到您关心的问题答案
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {faqCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <span>{category.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, qIndex) => (
                  <AccordionItem key={qIndex} value={`item-${index}-${qIndex}`}>
                    <AccordionTrigger className="text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-20 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">还有其他问题？</h2>
        <p className="text-muted-foreground mb-8">
          如果您没有找到想要的答案，欢迎随时联系我们的团队
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="mailto:contact@ideaalchemy.com">发送邮件</Link>
          </Button>
          <Button asChild>
            <Link href="/workspace">开始使用</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
