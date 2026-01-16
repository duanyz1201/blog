"use client"

import { useState, useRef } from "react"
import { CommentForm } from "./comment-form"
import { CommentList, CommentListRef } from "./comment-list"

type Comment = {
  id: string
  content: string
  author: string
  email: string
  createdAt: Date | string
  replies?: Comment[]
  parentId?: string
}

export function CommentSection({ 
  postId, 
  initialComments 
}: { 
  postId: string
  initialComments: Comment[]
}) {
  const [commentCount, setCommentCount] = useState(initialComments.length)
  const commentListRef = useRef<CommentListRef>(null)

  const handleCommentSuccess = (newComment?: Comment) => {
    if (newComment && commentListRef.current) {
      // 通过 ref 调用 CommentList 的 addComment 方法
      commentListRef.current.addComment(newComment)
    }
  }

  return (
    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-slate-800">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        评论 ({commentCount})
      </h2>
      <CommentForm postId={postId} onSuccess={handleCommentSuccess} />
      <div className="mt-8">
        <CommentList 
          ref={commentListRef}
          comments={initialComments} 
          postId={postId}
          onCommentCountChange={setCommentCount}
        />
      </div>
    </div>
  )
}
