"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const ticking = useRef(false)

  const toggleVisibility = useCallback(() => {
    // 滚动超过 500px 时显示按钮
    setIsVisible(window.pageYOffset > 500)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // 使用 requestAnimationFrame 节流
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          toggleVisibility()
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [toggleVisibility])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "w-12 h-12 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/25",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-xl hover:shadow-primary/30",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "cursor-pointer",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="返回顶部"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
