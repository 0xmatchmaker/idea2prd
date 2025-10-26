"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lightbulb, BookOpen, Map } from "lucide-react"
import { ThreeStepFlow } from "@/components/three-step-flow"

export default function HomePage() {
  const { t } = useLocale()

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">
          {t("hero.title")}
        </h1>
        <p className="text-2xl md:text-3xl text-primary/80 font-semibold mb-4">
          {t("hero.subtitle")}
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          {t("hero.description")}
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/workspace">
            {t("hero.cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
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
