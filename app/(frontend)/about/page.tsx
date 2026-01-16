import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">关于</h1>
          <div className="h-1 w-20 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* 主要内容 */}
        <div className="space-y-8">
          {/* 简介卡片 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">个人简介</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                欢迎来到我的个人博客！这里记录着我的技术学习和成长历程。
              </p>
              <p>
                我热爱编程，喜欢探索新技术，乐于分享知识。希望通过这个博客平台，能够与更多的技术爱好者交流学习。
              </p>
            </CardContent>
          </Card>

          {/* 技术栈卡片 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">技术栈</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm font-medium">Next.js</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm font-medium">React</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm font-medium">TypeScript</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm font-medium">Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm font-medium">Prisma</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-sm font-medium">PostgreSQL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 联系方式卡片 */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">联系方式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">邮箱：example@example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm">GitHub：github.com/username</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
