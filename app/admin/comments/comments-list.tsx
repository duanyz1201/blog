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
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      APPROVED: "default",
      PENDING: "secondary",
      REJECTED: "destructive",
      HIDDEN: "outline",
    }
    const labels: Record<string, string> = {
      APPROVED: "已通过",
      PENDING: "待审核",
      REJECTED: "已拒绝",
      HIDDEN: "已隐藏",
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

  const handleHide = async (commentId: string) => {
    setLoading(commentId)
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "HIDDEN" }),
      })

      if (!response.ok) {
        throw new Error("操作失败")
      }

      // 更新本地状态
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, status: "HIDDEN" }
          : comment
      ))

      // 刷新页面以同步数据
      router.refresh()
    } catch (error) {
      console.error("隐藏评论错误:", error)
      alert("操作失败，请稍后重试")
    } finally {
      setLoading(null)
    }
  }

  const handleUnhide = async (commentId: string) => {
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
      console.error("取消隐藏评论错误:", error)
      alert("操作失败，请稍后重试")
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("确定要删除这条评论吗？删除后无法恢复。")) {
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
    <div className="space-y-2">
      {comments.map((comment: any) => (
        <div
          key={comment.id}
          className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          {/* 第一行：用户信息、状态、时间、操作按钮 */}
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
              <span className="font-semibold text-sm">{comment.author}</span>
              <span className="text-xs text-muted-foreground truncate">
                {comment.email}
              </span>
              {getStatusBadge(comment.status)}
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {format(new Date(comment.createdAt), "yyyy年MM月dd日 HH:mm", { locale: zhCN })}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground sm:hidden">
                {format(new Date(comment.createdAt), "MM-dd HH:mm", { locale: zhCN })}
              </span>
              {comment.status === "PENDING" && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleApprove(comment.id)}
                    disabled={loading === comment.id}
                  >
                    {loading === comment.id ? "处理中..." : "通过"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleReject(comment.id)}
                    disabled={loading === comment.id}
                  >
                    {loading === comment.id ? "处理中..." : "拒绝"}
                  </Button>
                </>
              )}
              {comment.status === "HIDDEN" ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleUnhide(comment.id)}
                  disabled={loading === comment.id}
                >
                  {loading === comment.id ? "处理中..." : "取消隐藏"}
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleHide(comment.id)}
                  disabled={loading === comment.id}
                >
                  {loading === comment.id ? "处理中..." : "隐藏"}
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleDelete(comment.id)}
                disabled={loading === comment.id}
              >
                {loading === comment.id ? "删除中..." : "删除"}
              </Button>
            </div>
          </div>

          {/* 第二行：评论内容和文章标题 */}
          <div className="space-y-1">
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>
            <Link
              href={`/post/${comment.post.slug}`}
              className="inline-block text-xs text-primary hover:underline truncate max-w-full"
              title={comment.post.title}
            >
              📄 {comment.post.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
