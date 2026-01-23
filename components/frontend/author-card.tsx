"use client"

import Image from "next/image"
import { User } from "lucide-react"

interface AuthorCardProps {
  author: {
    name: string
    email?: string
    image?: string | null
    bio?: string
  }
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="flex items-start gap-6 p-6 bg-secondary/30 rounded-2xl">
        {/* 头像 */}
        <div className="flex-shrink-0">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-background shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center ring-4 ring-background shadow-lg">
              <User className="w-10 h-10 text-primary" />
            </div>
          )}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              作者
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {author.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {author.bio || "热爱技术，热爱分享。专注于 Web 开发和 AI 应用，致力于写出有价值的技术内容。"}
          </p>
        </div>
      </div>
    </div>
  )
}
