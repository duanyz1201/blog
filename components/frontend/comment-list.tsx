"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./comment-form"

type Comment = {
  id: string
  content: string
  author: string
  email: string
  createdAt: Date
  replies?: Comment[]
}

export function CommentList({ 
  comments, 
  postId 
}: { 
  comments: Comment[]
  postId: string 
}) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    const now = new Date()
    const commentDate = new Date(date)
    const diffInHours = (now.getTime() - commentDate.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return formatDistanceToNow(commentDate, { 
        addSuffix: true, 
        locale: zhCN 
      })
    }
    
    return format(commentDate, "yyyy年MM月dd日 HH:mm", { locale: zhCN })
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isReplying = replyingTo === comment.id

    return (
      <div className={depth > 0 ? "ml-8 mt-4" : ""}>
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap mb-4">{comment.content}</p>
            {depth < 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
              >
                {isReplying ? "取消回复" : "回复"}
              </Button>
            )}
            {isReplying && (
              <div className="mt-4">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onSuccess={() => {
                    setReplyingTo(null)
                    window.location.reload()
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>暂无评论，快来发表第一条评论吧！</p>
      </div>
    )
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
