import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getTags() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/tags`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return []
  }
  
  return res.json()
}

export default async function TagsPage() {
  const tags = await getTags()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">所有标签</h1>
      
      {tags.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无标签</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="inline-block"
            >
              <Badge variant="outline" className="text-base px-4 py-2 hover:bg-accent">
                {tag.name} ({tag._count.posts})
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
