"use client"

import { Share2, Twitter, Facebook, Link2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
}

export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    // 检查浏览器是否支持 Web Share API
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const fullUrl = typeof window !== "undefined" 
    ? `${window.location.origin}${url}`
    : url

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(title)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(fullUrl)}`
    window.open(twitterUrl, "_blank", "width=550,height=420")
  }

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    window.open(facebookUrl, "_blank", "width=550,height=420")
  }

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: fullUrl,
        })
      } catch (err) {
        // 用户取消分享
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            分享
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canShare && (
            <DropdownMenuItem onClick={shareViaWebShare}>
              <Share2 className="h-4 w-4 mr-2" />
              系统分享
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={shareToTwitter}>
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareToFacebook}>
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            {copied ? (
              <>
                <Copy className="h-4 w-4 mr-2" />
                已复制！
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                复制链接
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
