"use client"

import { Button } from "@/components/ui/button"
import { useLocale } from "./locale-provider"

export function LocaleToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <Button variant="ghost" size="sm" onClick={() => setLocale(locale === "zh" ? "en" : "zh")} className="font-medium">
      {locale === "zh" ? "EN" : "中文"}
    </Button>
  )
}
