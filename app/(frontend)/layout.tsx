import { ConditionalHeader } from "@/components/frontend/conditional-header"

async function getSiteName() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/settings`, {
      cache: "no-store",
    })
    if (response.ok) {
      const data = await response.json()
      return data.siteName || "个人博客"
    }
  } catch (error) {
    console.error("获取站点名称失败:", error)
  }
  return "个人博客"
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteName = await getSiteName()
  
  return (
    <div className="min-h-screen flex flex-col">
      <ConditionalHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 mt-auto bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
