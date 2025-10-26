"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  const { t } = useLocale()

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("pricing.title")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          从免费版开始体验，随时升级到专业版解锁全部功能
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="relative border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">{t("pricing.free.title")}</CardTitle>
            <CardDescription>适合个人体验</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{t("pricing.free.price")}</span>
              <span className="text-muted-foreground">/月</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.free.feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.free.feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.free.feature3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>3个行业模板</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-6">
              <Link href="/workspace">开始使用</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-2 border-primary hover:shadow-xl transition-shadow">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
            推荐
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">{t("pricing.pro.title")}</CardTitle>
            <CardDescription>适合专业用户</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{t("pricing.pro.price")}</span>
              <span className="text-muted-foreground">/月</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>无限项目保存（云端）</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.pro.feature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.pro.feature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.pro.feature3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{t("pricing.pro.feature4")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>AI 需求澄清（智能提问）</span>
              </li>
            </ul>
            <Button className="w-full mt-6" disabled>
              {t("pricing.comingSoon")}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              即将接入 Creem 支付系统
            </p>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="relative border-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">企业版</CardTitle>
            <CardDescription>适合团队协作</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">¥999</span>
              <span className="text-muted-foreground">/月</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Pro 版所有功能</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>团队协作（多人编辑）</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>API 访问权限</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>导出 n8n 工作流</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>专属客服支持</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>定制化需求</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full mt-6">
              <Link href="mailto:contact@ideaalchemy.com">联系我们</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">常见定价问题</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">可以取消订阅吗？</h3>
            <p className="text-muted-foreground">
              可以，您随时可以在账户设置中取消订阅，取消后将在当前计费周期结束后生效。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">支持哪些支付方式？</h3>
            <p className="text-muted-foreground">
              我们通过 Creem 支付系统支持支付宝、微信支付、信用卡等多种支付方式。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">有退款政策吗？</h3>
            <p className="text-muted-foreground">
              如果您在订阅后 7 天内不满意，可以申请全额退款，无需任何理由。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">可以随时升级或降级吗？</h3>
            <p className="text-muted-foreground">
              可以，您可以随时升级或降级订阅计划，费用将按比例调整。
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
        <p className="text-muted-foreground mb-8">
          从免费版开始，体验从想法到蓝图的完整流程
        </p>
        <Button asChild size="lg">
          <Link href="/workspace">免费开始使用</Link>
        </Button>
      </div>
    </div>
  )
}
