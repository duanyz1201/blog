import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { prisma } from "@/lib/db"

async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
    return tags
  } catch (error) {
    console.error("获取标签列表错误:", error)
    return []
  }
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">标签管理</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新建标签
        </Button>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无标签</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <div
              key={tag.id}
              className="p-3 border rounded-lg hover:bg-accent flex items-center gap-2"
            >
              <span className="font-medium">{tag.name}</span>
              <Badge variant="secondary">{tag._count.posts}</Badge>
              <Button variant="ghost" size="sm">
                编辑
              </Button>
              <Button variant="destructive" size="sm">
                删除
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
