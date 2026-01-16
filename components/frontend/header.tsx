"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, Home, FolderOpen, Tag } from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-white dark:bg-slate-900 border-b-2 border-gray-200 dark:border-slate-700 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo 和导航 */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              个人博客
            </Link>
            
            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Home className="h-4 w-4" />
                首页
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <FolderOpen className="h-4 w-4" />
                分类
              </Link>
              <Link 
                href="/tags" 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <Tag className="h-4 w-4" />
                标签
              </Link>
            </nav>
          </div>
          
          {/* 搜索框（桌面端） */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          {/* 右侧操作区 */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* 搜索按钮（移动端） */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-700 dark:text-gray-200"
              onClick={() => router.push("/search")}
              title="搜索"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <ThemeToggle />
            
            {session ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:inline">{session.user.name}</span>
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
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-gray-700 dark:text-gray-200">
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
              className="md:hidden text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Home className="h-5 w-5" />
                首页
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <FolderOpen className="h-5 w-5" />
                分类
              </Link>
              <Link
                href="/tags"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Tag className="h-5 w-5" />
                标签
              </Link>
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <Search className="h-5 w-5" />
                搜索
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
        )}
      </div>
    </header>
  )
}
