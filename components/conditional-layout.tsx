'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isWorkspace = pathname?.startsWith('/workspace')
  const isLogin = pathname?.startsWith('/login')

  // workspace 和 login 页面不显示导航和底部
  const hideNavAndFooter = isWorkspace || isLogin

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main className={hideNavAndFooter ? "" : "min-h-screen"}>
        {children}
      </main>
      {!hideNavAndFooter && <Footer />}
    </>
  )
}
