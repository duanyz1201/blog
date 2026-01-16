import { redirect } from "next/navigation"
import { Sidebar } from "@/components/admin/sidebar"
import { requireAdmin } from "@/lib/auth-helpers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 检查管理员权限
  await requireAdmin()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
