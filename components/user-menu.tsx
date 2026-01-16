"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>加载中...</div>
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" asChild>
          <a href="/auth/signin">登录</a>
        </Button>
        <Button asChild>
          <a href="/auth/signup">注册</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">欢迎，{session.user.name}</span>
      <Button variant="outline" onClick={() => signOut()}>
        退出
      </Button>
    </div>
  )
}
