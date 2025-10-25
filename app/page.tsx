"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, FileText, GitBranch, Download, BookOpen, Share2 } from "lucide-react"

export default function HomePage() {
  const { t } = useLocale()

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance leading-tight">{t("hero.title")}</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">{t("hero.subtitle")}</p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/workspace">
            {t("hero.cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("features.title")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-primary mb-2" />
              <CardTitle>{t("features.prd.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.prd.desc")}</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <GitBranch className="w-10 h-10 text-primary mb-2" />
              <CardTitle>{t("features.visual.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.visual.desc")}</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Download className="w-10 h-10 text-primary mb-2" />
              <CardTitle>{t("features.export.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.export.desc")}</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="w-10 h-10 text-primary mb-2" />
              <CardTitle>{t("features.template.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.template.desc")}</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Share2 className="w-10 h-10 text-primary mb-2" />
              <CardTitle>{t("features.share.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{t("features.share.desc")}</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-muted/50 -mx-4 px-4 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("process.title")}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("process.step1")}</h3>
            <p className="text-muted-foreground">{t("process.step1.desc")}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("process.step2")}</h3>
            <p className="text-muted-foreground">{t("process.step2.desc")}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("process.step3")}</h3>
            <p className="text-muted-foreground">{t("process.step3.desc")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
