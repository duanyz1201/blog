"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, Home, FolderOpen, Tag, Archive, User } from "lucide-react"

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
    <header className="sticky top-0 z-[100] w-full bg-background border-b border-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
            {/* Logo - 左侧 */}
            <Link 
              href="/" 
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors flex-shrink-0 cursor-pointer"
            >
              {siteName}
            </Link>

            {/* 导航链接 - 绝对居中 */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>首页</span>
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                <span>分类</span>
              </Link>
              <Link 
                href="/tags" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Tag className="w-4 h-4" />
                <span>标签</span>
              </Link>
              <Link 
                href="/archives" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Archive className="w-4 h-4" />
                <span>归档</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>关于</span>
              </Link>
            </div>

            {/* 右侧功能区 - 靠右 */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* 搜索按钮 */}
              <Link 
                href="/search"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">搜索</span>
              </Link>

              {/* 主题切换按钮 */}
              <ThemeToggle />

              {/* 登录/注册按钮 */}
              {session ? (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                      {session.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-foreground">{session.user.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    退出
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/auth/signin"
                    className="px-4 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    登录
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="px-4 py-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-colors cursor-pointer"
                  >
                    注册
                  </Link>
                </div>
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
            <div className="md:hidden border-t border-border bg-background">
              <div className="px-4 py-4">
                <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <Home className="w-4 h-4" />
                  首页
                </Link>
                <Link
                  href="/categories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  分类
                </Link>
                <Link
                  href="/tags"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  标签
                </Link>
                <Link
                  href="/archives"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  归档
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-accent rounded-lg cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4" />
                  关于
                </Link>
                {!session && (
                  <div className="flex gap-2 px-4 pt-3 mt-2 border-t border-border">
                    <Button variant="outline" asChild className="flex-1 cursor-pointer">
                      <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>登录</Link>
                    </Button>
                    <Button asChild className="flex-1 cursor-pointer">
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
