import { ConditionalHeader } from "@/components/frontend/conditional-header"

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ConditionalHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 mt-auto bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 个人博客. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
