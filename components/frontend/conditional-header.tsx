"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"

export function ConditionalHeader() {
  const pathname = usePathname()
  
  // 首页不显示默认Header（Hero区域有自己的导航）
  if (pathname === "/") {
    return null
  }
  
  return <Header />
}
