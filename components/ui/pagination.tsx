import * as React from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl
    return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${page}`
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // 如果总页数少于等于7页，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总是显示第一页
      pages.push(1)

      if (currentPage <= 3) {
        // 当前页在前3页
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后3页
        pages.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 当前页在中间
        pages.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="分页导航"
    >
      {/* 上一页按钮 */}
      {currentPage > 1 ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={getPageUrl(currentPage - 1)} aria-label="上一页">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 页码按钮 */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <Button key={`ellipsis-${index}`} variant="ghost" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )
        }

        const pageNum = page as number
        const isActive = pageNum === currentPage

        return (
          <Button
            key={pageNum}
            variant={isActive ? "default" : "outline"}
            size="icon"
            asChild
            className={cn(
              isActive && "bg-primary text-primary-foreground"
            )}
          >
            <Link href={getPageUrl(pageNum)} aria-label={`第 ${pageNum} 页`}>
              {pageNum}
            </Link>
          </Button>
        )
      })}

      {/* 下一页按钮 */}
      {currentPage < totalPages ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={getPageUrl(currentPage + 1)} aria-label="下一页">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
