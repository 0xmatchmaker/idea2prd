"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lightbulb, BookOpen, Map } from "lucide-react"
import { ThreeStepFlow } from "@/components/three-step-flow"
import { AnimatedBackground } from "@/components/animated-background"
import { HeroCTAButton } from "@/components/hero-cta-button"

export default function HomePage() {
  const { t } = useLocale()

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="relative py-24 md:py-40 text-center overflow-hidden">
        {/* 动态粒子背景 */}
        <AnimatedBackground />

        {/* Hero 内容 */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
            {t("hero.title")}
          </h1>

          {/* 渐变副标题 */}
          <p className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-blue-500 to-green-500">
            {t("hero.subtitle")}
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
            {t("hero.description")}
          </p>

          {/* 超级 CTA 按钮 */}
          <div className="flex flex-col items-center gap-4">
            <HeroCTAButton href="/workspace">
              🚀 {t("hero.cta")}
            </HeroCTAButton>

            <p className="text-sm text-muted-foreground">
              不需要完整的需求，只需要一个想法
            </p>
          </div>
        </div>
      </section>

      {/* Three Step Flow */}
      <ThreeStepFlow />

      {/* Core Features Section */}
      <section id="features" className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("features.title")}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1: Idea */}
          <Card className="border-2 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Lightbulb className="w-10 h-10 text-yellow-600 mb-2" />
              <CardTitle>{t("features.idea.title")}</CardTitle>
              <p className="text-sm text-muted-foreground font-semibold">
                {t("features.idea.subtitle")}
              </p>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.idea.desc")}</CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2: Story */}
          <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>{t("features.story.title")}</CardTitle>
              <p className="text-sm text-muted-foreground font-semibold">
                {t("features.story.subtitle")}
              </p>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.story.desc")}</CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3: Blueprint */}
          <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Map className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>{t("features.blueprint.title")}</CardTitle>
              <p className="text-sm text-muted-foreground font-semibold">
                {t("features.blueprint.subtitle")}
              </p>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.blueprint.desc")}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t("nav.examples")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t("examples.subtitle")}
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* E-commerce Template */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🛒</div>
              <CardTitle>{t("examples.ecommerce.title")}</CardTitle>
              <CardDescription>{t("examples.ecommerce.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-yellow-600 mb-1">💡 {t("flow.step1.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.ecommerce.idea")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">📖 {t("flow.step2.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.ecommerce.story")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-green-600 mb-1">🎨 {t("flow.step3.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.ecommerce.blueprint")}</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/workspace?template=ecommerce">{t("examples.useTemplate")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Education Template */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🎓</div>
              <CardTitle>{t("examples.education.title")}</CardTitle>
              <CardDescription>{t("examples.education.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-yellow-600 mb-1">💡 {t("flow.step1.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.education.idea")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">📖 {t("flow.step2.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.education.story")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-green-600 mb-1">🎨 {t("flow.step3.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.education.blueprint")}</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/workspace?template=education">{t("examples.useTemplate")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Social Template */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">💬</div>
              <CardTitle>{t("examples.social.title")}</CardTitle>
              <CardDescription>{t("examples.social.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-yellow-600 mb-1">💡 {t("flow.step1.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.social.idea")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">📖 {t("flow.step2.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.social.story")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-green-600 mb-1">🎨 {t("flow.step3.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.social.blueprint")}</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/workspace?template=social">{t("examples.useTemplate")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* SaaS Template */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🏢</div>
              <CardTitle>{t("examples.saas.title")}</CardTitle>
              <CardDescription>{t("examples.saas.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-yellow-600 mb-1">💡 {t("flow.step1.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.saas.idea")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">📖 {t("flow.step2.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.saas.story")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-green-600 mb-1">🎨 {t("flow.step3.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.saas.blueprint")}</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/workspace?template=saas">{t("examples.useTemplate")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Payment Template */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">💰</div>
              <CardTitle>{t("examples.payment.title")}</CardTitle>
              <CardDescription>{t("examples.payment.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-yellow-600 mb-1">💡 {t("flow.step1.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.payment.idea")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">📖 {t("flow.step2.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.payment.story")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-green-600 mb-1">🎨 {t("flow.step3.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.payment.blueprint")}</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/workspace?template=payment">{t("examples.useTemplate")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Assistant Template */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🤖</div>
              <CardTitle>{t("examples.ai.title")}</CardTitle>
              <CardDescription>{t("examples.ai.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-yellow-600 mb-1">💡 {t("flow.step1.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.ai.idea")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-600 mb-1">📖 {t("flow.step2.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.ai.story")}</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-green-600 mb-1">🎨 {t("flow.step3.title").split("·")[0].trim()}</p>
                <p className="text-muted-foreground">{t("examples.ai.blueprint")}</p>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/workspace?template=ai">{t("examples.useTemplate")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Process Section */}
      <section className="py-20 bg-muted/50 -mx-4 px-4 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("process.title")}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-2 border-yellow-300">
              💡
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("process.step1")}</h3>
            <p className="text-muted-foreground">{t("process.step1.desc")}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-2 border-blue-300">
              📖
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("process.step2")}</h3>
            <p className="text-muted-foreground">{t("process.step2.desc")}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 border-2 border-green-300">
              🎨
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("process.step3")}</h3>
            <p className="text-muted-foreground">{t("process.step3.desc")}</p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="gap-2">
            <Link href="/workspace">
              🚀 {t("hero.cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            不需要完整的需求，只需要一个想法
          </p>
        </div>
      </section>
    </div>
  )
}
