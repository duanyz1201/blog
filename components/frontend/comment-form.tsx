"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { commentSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CommentFormData = {
  content: string
  author: string
  email: string
  postId: string
  parentId?: string
}

export function CommentForm({
  postId,
  parentId,
  onSuccess,
}: {
  postId: string
  parentId?: string
  onSuccess?: (comment?: any) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      postId,
      parentId,
    },
  })

  const onSubmit = async (data: CommentFormData) => {
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "评论提交失败")
        return
      }

      // 如果评论默认通过，立即将新评论添加到列表
      if (onSuccess && result.comment) {
        // 立即调用回调，传入新评论
        onSuccess(result.comment)
        // 重置表单
        reset()
        // 显示成功提示，3秒后自动消失
        setSuccessMessage(result.message || "评论已发布成功！")
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setSuccessMessage("")
        }, 3000)
      } else {
        // 如果没有回调，显示成功消息
        setSuccessMessage("评论已发布成功！")
        setSuccess(true)
        reset()
        setTimeout(() => {
          setSuccess(false)
          setSuccessMessage("")
        }, 3000)
      }
    } catch (error) {
      setError("评论提交失败，请稍后重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-green-800 dark:text-green-200 font-medium">
            ✓ {successMessage || "评论已发布成功！"}
          </p>
        </div>
      )}
      {error && (
        <div className="p-3 bg-destructive/15 text-destructive text-sm rounded-md animate-in fade-in slide-in-from-top-2 duration-300">
          ✗ {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">昵称 *</Label>
          <Input
            id="author"
            {...register("author")}
            placeholder="您的昵称"
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">邮箱 *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">评论内容 *</Label>
        <Textarea
          id="content"
          {...register("content")}
          placeholder="请输入您的评论..."
          rows={4}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "提交中..." : "提交评论"}
      </Button>
    </form>
  )
}
