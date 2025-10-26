'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroCTAButtonProps {
  children: React.ReactNode
  href: string
  className?: string
}

export function HeroCTAButton({ children, href, className }: HeroCTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        // 基础样式
        "group relative inline-flex items-center justify-center gap-3",
        "min-w-[280px] md:min-w-[360px] h-20",
        "px-8 py-6",
        "rounded-2xl",
        "text-2xl font-bold text-white",

        // 渐变背景
        "bg-gradient-to-r from-primary via-blue-600 to-green-600",
        "bg-size-200 bg-pos-0",

        // 阴影和光晕
        "shadow-2xl",
        "hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]",

        // 过渡效果
        "transition-all duration-300 ease-out",

        // 悬停效果
        "hover:scale-105 hover:bg-pos-100",

        // 点击效果
        "active:scale-98",

        // 无障碍
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50",

        // 性能优化
        "will-change-transform",

        className
      )}
    >
      {/* 内部光泽效果 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />

      {/* 内容 */}
      <span className="relative z-10 flex items-center gap-3">
        {children}

        {/* 箭头动画 */}
        <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1 arrow-slide" />
      </span>

      {/* 外部光晕 */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-green-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
    </Link>
  )
}
