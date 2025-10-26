import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LocaleProvider } from "@/components/locale-provider"
import { ConditionalLayout } from "@/components/conditional-layout"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Idea炼金术 · Idea Alchemy",
  description: "把不完整的 idea 炼成可执行的一页PRD与用户流程图",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning className="scroll-smooth">
      <body className={inter.className}>
        <LocaleProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </LocaleProvider>
      </body>
    </html>
  )
}
