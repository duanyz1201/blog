"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import Link from "next/link"

type Comment = {
  id: string
  author: string
  email: string
  content: string
  status: string
  createdAt: Date
  post: {
    title: string
    slug: string
  }
}

export function CommentsList({ comments: initialComments }: { comments: Comment[] }) {
  const router = useRouter()
  const [comments, setComments] = useState(initialComments)
  const [loading, setLoading] = useState<string | null>(null)

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

  const handleApprove = async (commentId: string) => {
    setLoading(commentId)
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      })

      if (!response.ok) {
        throw new Error("操作失败")
      }

      // 更新本地状态
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, status: "APPROVED" }
          : comment
      ))

      // 刷新页面以同步数据
      router.refresh()
    } catch (error) {
      console.error("通过评论错误:", error)
      alert("操作失败，请稍后重试")
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (commentId: string) => {
    setLoading(commentId)
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "REJECTED" }),
      })

      if (!response.ok) {
        throw new Error("操作失败")
      }

      // 更新本地状态
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, status: "REJECTED" }
          : comment
      ))

      // 刷新页面以同步数据
      router.refresh()
    } catch (error) {
      console.error("拒绝评论错误:", error)
      alert("操作失败，请稍后重试")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("确定要删除这条评论吗？")) {
      return
    }

    setLoading(commentId)
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("删除失败")
      }

      // 从列表中移除
      setComments(comments.filter(comment => comment.id !== commentId))

      // 刷新页面以同步数据
      router.refresh()
    } catch (error) {
      console.error("删除评论错误:", error)
      alert("删除失败，请稍后重试")
    } finally {
      setLoading(null)
    }
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>暂无评论</p>
      </div>
    )
  }

  return (
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApprove(comment.id)}
                  disabled={loading === comment.id}
                >
                  {loading === comment.id ? "处理中..." : "通过"}
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleReject(comment.id)}
                  disabled={loading === comment.id}
                >
                  {loading === comment.id ? "处理中..." : "拒绝"}
                </Button>
              </>
            )}
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => handleDelete(comment.id)}
              disabled={loading === comment.id}
            >
              {loading === comment.id ? "删除中..." : "删除"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
