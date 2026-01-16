import { auth } from "./auth"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

/**
 * 获取当前登录用户
 */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user || null
}

/**
 * 要求用户必须登录，否则重定向到登录页
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/signin")
  }
  return user
}

/**
 * 要求用户必须具有指定角色
 */
export async function requireRole(role: Role | Role[]) {
  const user = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(user.role)) {
    redirect("/")
  }
  
  return user
}

/**
 * 要求用户必须是管理员
 */
export async function requireAdmin() {
  return requireRole("ADMIN")
}
