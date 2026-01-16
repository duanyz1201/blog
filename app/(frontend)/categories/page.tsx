import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getCategories() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/categories`, {
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
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">所有分类</h1>
      
      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无分类</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: any) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>
                  <Link href={`/categories/${category.slug}`} className="hover:underline">
                    {category.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  {category._count.posts} 篇文章
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
