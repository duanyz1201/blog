"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isExpanded, setIsExpanded] = useState(true)
  const tocListRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  // 清理 itemRefs
  useEffect(() => {
    return () => {
      itemRefs.current.clear()
    }
  }, [])

  // 从 DOM 中提取标题（等待渲染完成后）
  useEffect(() => {
    const extractHeadings = () => {
      // 从渲染后的 DOM 提取标题，确保获取正确的 ID
      const articleElement = document.querySelector("article")
      if (!articleElement) return

      const headingElements = articleElement.querySelectorAll("h2, h3, h4")
      const matches: TocItem[] = []

      headingElements.forEach((el) => {
        const id = el.id
        if (!id) return // 跳过没有 ID 的标题

        const level = parseInt(el.tagName.charAt(1))
        const text = el.textContent?.trim() || ""

        matches.push({ id, text, level })
      })

      setHeadings(matches)
      
      // 设置初始活动标题
      if (matches.length > 0) {
        setActiveId(matches[0].id)
      }
    }

    // 延迟执行以确保 DOM 渲染完成
    const timer = setTimeout(extractHeadings, 100)
    return () => clearTimeout(timer)
  }, [content])

  // 当活动标题改变时，自动滚动目录使高亮项可见
  useEffect(() => {
    if (!activeId || !tocListRef.current) return

    const activeItem = itemRefs.current.get(activeId)
    if (activeItem) {
      // 计算目录容器和活动项的位置
      const container = tocListRef.current
      const itemTop = activeItem.offsetTop
      const itemHeight = activeItem.offsetHeight
      const containerHeight = container.clientHeight
      const scrollTop = container.scrollTop

      // 如果活动项不在可视区域内，滚动到可见位置
      if (itemTop < scrollTop) {
        // 活动项在上方，滚动到项顶部
        container.scrollTo({ top: itemTop - 8, behavior: "smooth" })
      } else if (itemTop + itemHeight > scrollTop + containerHeight) {
        // 活动项在下方，滚动到项底部
        container.scrollTo({ top: itemTop + itemHeight - containerHeight + 8, behavior: "smooth" })
      }
    }
  }, [activeId])

  // 基于滚动位置更新活动标题
  const handleScroll = useCallback(() => {
    if (headings.length === 0) return

    const scrollPosition = window.scrollY + 120 // 偏移量

    // 找到当前可见的标题
    let currentId = headings[0]?.id || ""

    for (const heading of headings) {
      const element = document.getElementById(heading.id)
      if (element) {
        const offsetTop = element.offsetTop
        if (scrollPosition >= offsetTop) {
          currentId = heading.id
        }
      }
    }

    setActiveId(currentId)
  }, [headings])

  // 监听滚动事件
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // 初始调用

    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <nav className="hidden xl:block fixed right-8 top-28 w-72 max-h-[calc(100vh-8rem)]">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg flex flex-col max-h-[calc(100vh-9rem)]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3 w-full hover:text-primary transition-colors cursor-pointer shrink-0"
        >
          <List className="w-4 h-4" />
          <span>目录</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {isExpanded ? "收起" : "展开"}
          </span>
        </button>

        {isExpanded && (
          <ul 
            ref={tocListRef}
            className="space-y-1 overflow-y-auto flex-1 pr-1 scrollbar-thin"
          >
            {headings.map((heading) => (
              <li
                key={heading.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(heading.id, el)
                }}
                style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
              >
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    "text-left text-sm py-1.5 px-2 rounded-md w-full transition-all duration-200 cursor-pointer",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeId === heading.id
                      ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  )
}
