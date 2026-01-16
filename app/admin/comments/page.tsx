import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import Link from "next/link"

async function getComments() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/comments`, {
    cache: "no-store",
  })
  
  if (!res.ok) {
    return { comments: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
  }
  
  return res.json()
}

export default async function CommentsPage() {
  const { comments } = await getComments()

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      APPROVED: "default",
      PENDING: "secondary",
      REJECTED: "destructive",
    }
    const labels: Record<string, string> = {
      APPROVED: "已通过",
      PENDING: "待审核",
      REJECTED: "已拒绝",
    }
    return (
      <Badge variant={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">评论管理</h1>

      {comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无评论</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div
              key={comment.id}
              className="p-4 border rounded-lg hover:bg-accent"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {comment.email}
                    </span>
                    {getStatusBadge(comment.status)}
                  </div>
                  <p className="text-sm mb-2 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <Link
                    href={`/post/${comment.post.slug}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {comment.post.title}
                  </Link>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {comment.status === "PENDING" && (
                  <>
                    <Button variant="outline" size="sm">
                      通过
                    </Button>
                    <Button variant="destructive" size="sm">
                      拒绝
                    </Button>
                  </>
                )}
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
