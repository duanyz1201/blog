import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tag as TagIcon } from "lucide-react"

type Tag = {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export function TagCloud({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null

  // 根据文章数量计算标签大小和样式
  const maxCount = Math.max(...tags.map(t => t._count.posts))
  const minCount = Math.min(...tags.map(t => t._count.posts))

  const getTagStyle = (count: number) => {
    if (maxCount === minCount) {
      return {
        size: "text-sm",
        padding: "px-3 py-1.5",
        weight: "font-medium",
      }
    }
    const ratio = (count - minCount) / (maxCount - minCount)
    if (ratio > 0.7) {
      return {
        size: "text-lg",
        padding: "px-4 py-2",
        weight: "font-bold",
      }
    }
    if (ratio > 0.4) {
      return {
        size: "text-base",
        padding: "px-3.5 py-1.5",
        weight: "font-semibold",
      }
    }
    return {
      size: "text-sm",
      padding: "px-3 py-1",
      weight: "font-medium",
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-sm">
          <TagIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">热门标签</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Popular Tags</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag) => {
          const style = getTagStyle(tag._count.posts)
          return (
            <Link key={tag.id} href={`/tags/${tag.slug}`}>
              <Badge
                variant="outline"
                className={`${style.size} ${style.padding} ${style.weight} hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-110 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-lg border-2 bg-white/30 dark:bg-white/10 backdrop-blur-sm`}
              >
                #{tag.name} <span className="opacity-70">({tag._count.posts})</span>
              </Badge>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
