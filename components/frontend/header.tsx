"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Search, Menu, X } from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [siteName, setSiteName] = useState("个人博客")

  // 获取站点名称
  useEffect(() => {
    const fetchSiteName = async () => {
      try {
        const response = await fetch("/api/settings")
        if (response.ok) {
          const data = await response.json()
          if (data.siteName) {
            setSiteName(data.siteName)
          }
        }
      } catch (error) {
        console.error("获取站点名称失败:", error)
      }
    }
    
    fetchSiteName()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
            {/* Logo - 左侧 */}
            <Link 
              href="/" 
              className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0"
            >
              {siteName}
            </Link>

            {/* 导航链接 - 绝对居中 */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>🏠</span>
                <span>首页</span>
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>📂</span>
                <span>分类</span>
              </Link>
              <Link 
                href="/tags" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>🏷️</span>
                <span>标签</span>
              </Link>
              <Link 
                href="/archives" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>📚</span>
                <span>归档</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>👤</span>
                <span>关于</span>
              </Link>
            </div>

            {/* 右侧功能区 - 靠右 */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* 搜索按钮 */}
              <Link 
                href="/search"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">搜索</span>
              </Link>

              {/* 主题切换按钮 */}
              <ThemeToggle />

              {/* 登录/注册按钮 */}
              {session ? (
                <>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline px-2">{session.user.name}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="border-gray-300 dark:border-slate-600"
                  >
                    退出
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                    <Link href="/auth/signin">登录</Link>
                  </Button>
                  <Button size="sm" asChild className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/auth/signup">注册</Link>
                  </Button>
                </>
              )}

              {/* 移动端菜单按钮 */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* 移动端菜单 */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="px-4 py-4">
                <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span>🏠</span>
                  首页
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span>📂</span>
                  分类
                </Link>
                <Link
                  href="/tags"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span>🏷️</span>
                  标签
                </Link>
                <Link
                  href="/archives"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span>📚</span>
                  归档
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span>👤</span>
                  关于
                </Link>
                {!session && (
                  <div className="flex gap-2 px-4 pt-3 mt-2 border-t border-gray-200 dark:border-slate-700">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>登录</Link>
                    </Button>
                    <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>注册</Link>
                    </Button>
                  </div>
                )}
                </nav>
              </div>
            </div>
          )}
        </nav>
      </header>
    )
  }
