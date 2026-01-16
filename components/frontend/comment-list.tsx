"use client"

import { useState, useImperativeHandle, forwardRef } from "react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CommentForm } from "./comment-form"
import { CommentAvatar } from "./comment-avatar"

type Comment = {
  id: string
  content: string
  author: string
  email: string
  createdAt: Date | string
  replies?: Comment[]
  parentId?: string
}

export interface CommentListRef {
  addComment: (comment: Comment) => void
}

export const CommentList = forwardRef<CommentListRef, {
  comments: Comment[]
  postId: string
  onCommentCountChange?: (count: number) => void
}>(({ comments: initialComments, postId, onCommentCountChange }, ref) => {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // 添加新评论到列表
  const addComment = (newComment: Comment) => {
    // 格式化新评论的日期
    const formattedComment: Comment = {
      ...newComment,
      createdAt: newComment.createdAt || new Date(),
      replies: newComment.replies || []
    }

    setComments(prev => {
      let updatedComments: Comment[]
      
      if (newComment.parentId) {
        // 如果是回复，找到父评论并添加到其 replies 中
        const updateComments = (commentList: Comment[]): Comment[] => {
          return commentList.map(comment => {
            if (comment.id === newComment.parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), formattedComment]
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              }
            }
            return comment
          })
        }
        updatedComments = updateComments(prev)
        // 回复不增加顶层评论数
      } else {
        // 如果是新评论，添加到列表顶部
        updatedComments = [formattedComment, ...prev]
        // 新评论会增加计数
        if (onCommentCountChange) {
          onCommentCountChange(updatedComments.length)
        }
      }
      
      return updatedComments
    })
  }

  // 使用 useImperativeHandle 暴露 addComment 方法
  useImperativeHandle(ref, () => ({
    addComment
  }))

  const formatDate = (date: Date | string) => {
    const commentDate = typeof date === 'string' ? new Date(date) : date
    return format(commentDate, "yyyy年MM月dd日 HH:mm", { locale: zhCN })
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isReplying = replyingTo === comment.id

    return (
      <div className={depth > 0 ? "ml-6 mt-2" : ""}>
        <Card className="mb-2 hover:shadow-md transition-shadow">
          <CardContent className="pt-3 pb-3">
            <div className="flex items-start gap-3">
              {/* 头像 */}
              <CommentAvatar 
                name={comment.author} 
                email={comment.email}
                size={depth > 0 ? 32 : 40}
              />
              
              {/* 评论内容区域 */}
              <div className="flex-1 min-w-0">
                {/* 用户名和时间 */}
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  {/* 回复按钮放在右上角 */}
                  {depth < 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-primary shrink-0"
                      onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                    >
                      {isReplying ? "取消回复" : "回复"}
                    </Button>
                  )}
                </div>
                
                {/* 评论内容 */}
                <p className="text-sm whitespace-pre-wrap mb-2 leading-relaxed text-gray-700 dark:text-gray-300">
                  {comment.content}
                </p>
                
                {/* 回复表单 */}
                {isReplying && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                    <CommentForm
                      postId={postId}
                      parentId={comment.id}
                      onSuccess={(newComment) => {
                        setReplyingTo(null)
                        if (newComment) {
                          addComment(newComment)
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
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
})

CommentList.displayName = "CommentList"
