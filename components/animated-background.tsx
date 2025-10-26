'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
  color: string
  opacity: number
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // 检测用户是否偏好减少动画
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    // 根据屏幕尺寸调整粒子数量
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 8 : 15

    // 生成粒子
    const newParticles: Particle[] = []

    // 定义三种颜色区域
    const colorGroups = [
      { colors: ['#fbbf24', '#f59e0b', '#fcd34d'], name: 'yellow' }, // Idea - 黄色
      { colors: ['#60a5fa', '#3b82f6', '#93c5fd'], name: 'blue' },   // Story - 蓝色
      { colors: ['#34d399', '#10b981', '#6ee7b7'], name: 'green' }   // Blueprint - 绿色
    ]

    for (let i = 0; i < particleCount; i++) {
      const groupIndex = i % 3
      const group = colorGroups[groupIndex]
      const color = group.colors[Math.floor(Math.random() * group.colors.length)]

      // 根据颜色组确定 x 位置范围
      let xMin, xMax
      if (groupIndex === 0) { // 黄色在左侧
        xMin = 0
        xMax = 35
      } else if (groupIndex === 1) { // 蓝色在中间
        xMin = 30
        xMax = 70
      } else { // 绿色在右侧
        xMin = 65
        xMax = 100
      }

      newParticles.push({
        id: i,
        size: Math.random() * 40 + 10, // 10-50px
        x: Math.random() * (xMax - xMin) + xMin,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10, // 10-20秒
        delay: Math.random() * 5, // 0-5秒延迟
        color,
        opacity: Math.random() * 0.4 + 0.3 // 0.3-0.7
      })
    }

    setParticles(newParticles)
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    // 静态渐变背景
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* 基础渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50" />

      {/* 粒子层 */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle absolute rounded-full blur-xl"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      {/* 柔和的渐变叠加层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  )
}
