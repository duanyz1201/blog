import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderOpen } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export function CategoryList({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  const colors = [
    "from-blue-500/20 to-cyan-500/20",
    "from-purple-500/20 to-pink-500/20",
    "from-green-500/20 to-emerald-500/20",
    "from-orange-500/20 to-red-500/20",
    "from-indigo-500/20 to-blue-500/20",
    "from-pink-500/20 to-rose-500/20",
  ]

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-sm">
          <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">分类</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Categories</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {categories.map((category, index) => {
          const colorClass = colors[index % colors.length]
          return (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group relative overflow-hidden hover:shadow-lg hover:-translate-x-1 transition-all duration-300 border border-white/20 dark:border-white/10 shadow-sm bg-white/40 dark:bg-white/5 backdrop-blur-md">
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="relative p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="group-hover:bg-primary/20 transition-colors shadow-sm">
                      {category._count.posts}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
