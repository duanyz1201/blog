import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getCategories() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/categories`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return []
  }
  
  return res.json()
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">分类管理</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新建分类
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无分类</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => (
            <div
              key={category.id}
              className="p-4 border rounded-lg hover:bg-accent"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{category.name}</h3>
                <Badge variant="secondary">{category._count.posts} 篇</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {category.slug}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  编辑
                </Button>
                <Button variant="destructive" size="sm">
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
