"use client"

import Link from "next/link"
import { useLocale } from "./locale-provider"
import { LocaleToggle } from "./locale-toggle"
import { Button } from "./ui/button"

export function Navbar() {
  const { t } = useLocale()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">⚗️</span>
          </div>
          <span className="font-bold text-lg">{t("nav.brand")}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.features")}
          </Link>
          <Link href="/examples" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.examples")}
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.pricing")}
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:text-primary transition-colors">
            {t("nav.faq")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LocaleToggle />
          <Button asChild>
            <Link href="/workspace">{t("nav.getStarted")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
