"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { ChevronLeft, ChevronRight, ChevronDown, Github, Mail, Rss, Twitter, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

// 背景图片列表 - 精选自然风景
const heroImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80", // 山景
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80", // 森林
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80", // 阳光森林
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80", // 湖泊山景
]

type Stats = {
  totalPosts: number
  totalCategories: number
  totalTags: number
  totalViews: number | null
}

export function HeroSection({ stats, siteName = "个人博客" }: { stats: Stats; siteName?: string }) {
  const { data: session } = useSession()
  const [currentImage, setCurrentImage] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSiteName, setCurrentSiteName] = useState(siteName)
  const totalViews =
    typeof stats.totalViews === "number"
      ? stats.totalViews
      : (stats as { totalViews?: { _sum?: { views?: number | null } } })
          .totalViews?._sum?.views ?? 0

  // 如果 props 中没有传入站点名称，则从 API 获取
  useEffect(() => {
    if (!siteName || siteName === "个人博客") {
      const fetchSiteName = async () => {
        try {
          const response = await fetch("/api/settings", {
            cache: "no-store",
          })
          if (response.ok) {
            const data = await response.json()
            if (data.siteName) {
              setCurrentSiteName(data.siteName)
            }
          }
        } catch (error) {
          console.error("获取站点名称失败:", error)
        }
      }
      
      fetchSiteName()
    } else {
      setCurrentSiteName(siteName)
    }
  }, [siteName])

  useEffect(() => {
    setIsLoaded(true)
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length)
  }

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 背景图片轮播 */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

      {/* 顶部导航 */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-20 items-center justify-between">
            {/* Logo - 左侧 */}
            <Link 
              href="/" 
              className="text-2xl font-bold text-white hover:text-white/80 transition-colors flex-shrink-0"
            >
              {currentSiteName}
            </Link>

            {/* 导航链接 - 绝对居中 */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <span>🏠</span>
                <span>首页</span>
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <span>📂</span>
                <span>分类</span>
              </Link>
              <Link 
                href="/tags" 
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <span>🏷️</span>
                <span>标签</span>
              </Link>
              <Link 
                href="/archives" 
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <span>📚</span>
                <span>归档</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">搜索</span>
              </Link>

              {/* 主题切换按钮 */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full overflow-hidden [&_button]:bg-transparent [&_button]:border-0 [&_button]:text-white [&_button]:hover:bg-white/10 [&_button]:rounded-full">
                <ThemeToggle />
              </div>

              {/* 登录/注册按钮 */}
              {session ? (
                <>
                  <span className="text-sm text-white/90 hidden sm:inline px-2">{session.user.name}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => signOut()}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white"
                  >
                    退出
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="hidden sm:inline-flex bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:text-white transition-all"
                  >
                    <Link href="/auth/signin">登录</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="hidden sm:inline-flex bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:text-white transition-all"
                  >
                    <Link href="/auth/signup">注册</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 中心内容 */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* 副标题/格言 */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl">
            记录技术成长，分享生活感悟
          </p>

          {/* 统计数据 */}
          <div className="flex items-center justify-center gap-8 mb-12 text-white/70 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.totalPosts}</div>
              <div className="text-sm">文章</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.totalCategories}</div>
              <div className="text-sm">分类</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{stats.totalTags}</div>
              <div className="text-sm">标签</div>
            </div>
            {totalViews > 0 && (
              <>
                <div className="w-px h-10 bg-white/30" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</div>
                  <div className="text-sm">阅读</div>
                </div>
              </>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex items-center justify-center gap-4 mb-12 flex-wrap">
            <Button
              onClick={scrollToContent}
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all px-8 py-6 text-lg rounded-full"
            >
              <ChevronDown className="mr-2 h-5 w-5" />
              开始阅读
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all px-8 py-6 text-lg rounded-full"
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
          </div>

          {/* 社交图标 */}
          <div className="flex items-center justify-center gap-6">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Github className="h-5 w-5" />
          </a>
          <a 
            href="mailto:example@email.com"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a 
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a 
            href="/rss"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Rss className="h-5 w-5" />
          </a>
          </div>
        </div>
      </div>

      {/* 左右切换箭头 */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
        aria-label="上一张"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
        aria-label="下一张"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* 轮播指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImage 
                ? "w-8 bg-white" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`切换到第${index + 1}张图片`}
          />
        ))}
      </div>

      {/* 向下滚动提示 */}
      <div 
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 animate-bounce cursor-pointer z-20"
        onClick={scrollToContent}
      >
        <ChevronDown className="h-8 w-8" />
      </div>
    </div>
  )
}
