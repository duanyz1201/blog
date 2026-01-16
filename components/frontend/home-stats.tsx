import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, FolderOpen, Tag, Eye } from "lucide-react"

interface Stats {
  totalPosts: number
  totalCategories: number
  totalTags: number
  totalViews: {
    views: number | null
  } | null
}

const statConfigs = [
  {
    icon: FileText,
    value: (stats: Stats) => stats.totalPosts,
    label: "文章总数",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FolderOpen,
    value: (stats: Stats) => stats.totalCategories,
    label: "分类",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Tag,
    value: (stats: Stats) => stats.totalTags,
    label: "标签",
    gradient: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Eye,
    value: (stats: Stats) => stats.totalViews?.views?.toLocaleString() || 0,
    label: "总阅读量",
    gradient: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
  },
]

export function HomeStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {statConfigs.map((config, index) => {
        const Icon = config.icon
        const value = config.value(stats)
        
        return (
          <Card 
            key={index}
            className="group relative overflow-hidden border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/40 dark:bg-white/5 backdrop-blur-md"
          >
            {/* 背景渐变 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* 装饰性光效 */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3.5 rounded-2xl ${config.bgColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <Icon className={`h-6 w-6 ${config.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  {value}
                </p>
                <p className="text-sm text-muted-foreground font-medium">{config.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
