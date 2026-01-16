"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Folder,
  Tag,
  MessageSquare,
  Settings,
  Home,
} from "lucide-react"

const menuItems = [
  {
    title: "仪表盘",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "文章管理",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "分类管理",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    title: "标签管理",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    title: "评论管理",
    href: "/admin/comments",
    icon: MessageSquare,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background min-h-screen">
      <div className="p-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold">后台管理</h2>
        </Link>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        <div className="mt-8 pt-8 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <Home className="h-4 w-4" />
            返回前台
          </Link>
        </div>
      </div>
    </aside>
  )
}
