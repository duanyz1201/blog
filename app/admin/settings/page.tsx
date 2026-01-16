"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Globe, MessageSquare, Search, Mail, Bell } from "lucide-react"

type SettingsData = {
  siteInfo?: {
    siteName: string
    siteDescription: string
    siteUrl: string
    authorName: string
    authorEmail: string
  }
  commentSettings?: {
    commentDefaultStatus: "APPROVED" | "PENDING"
    commentsPerPage: number
    enableNestedComments: boolean
    maxNestedDepth: number
  }
  seoSettings?: {
    metaKeywords: string
    metaDescription: string
    enableSitemap: boolean
    enableRSS: boolean
  }
  otherSettings?: {
    postsPerPage: number
    enableDarkMode: boolean
  }
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // 站点基本信息
  const [siteName, setSiteName] = useState("个人博客")
  const [siteDescription, setSiteDescription] = useState("")
  const [siteUrl, setSiteUrl] = useState("")
  const [authorName, setAuthorName] = useState("管理员")
  const [authorEmail, setAuthorEmail] = useState("")

  // 评论设置
  const [commentDefaultStatus, setCommentDefaultStatus] = useState<"APPROVED" | "PENDING">("APPROVED")
  const [commentsPerPage, setCommentsPerPage] = useState(10)
  const [enableNestedComments, setEnableNestedComments] = useState(true)
  const [maxNestedDepth, setMaxNestedDepth] = useState(2)

  // SEO设置
  const [metaKeywords, setMetaKeywords] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [enableSitemap, setEnableSitemap] = useState(true)
  const [enableRSS, setEnableRSS] = useState(true)

  // 其他设置
  const [postsPerPage, setPostsPerPage] = useState(10)
  const [enableDarkMode, setEnableDarkMode] = useState(true)

  // 加载设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings")
        if (response.ok) {
          const data: SettingsData = await response.json()
          
          if (data.siteInfo) {
            setSiteName(data.siteInfo.siteName || "个人博客")
            setSiteDescription(data.siteInfo.siteDescription || "")
            setSiteUrl(data.siteInfo.siteUrl || "")
            setAuthorName(data.siteInfo.authorName || "管理员")
            setAuthorEmail(data.siteInfo.authorEmail || "")
          }
          
          if (data.commentSettings) {
            setCommentDefaultStatus(data.commentSettings.commentDefaultStatus || "APPROVED")
            setCommentsPerPage(data.commentSettings.commentsPerPage || 10)
            setEnableNestedComments(data.commentSettings.enableNestedComments ?? true)
            setMaxNestedDepth(data.commentSettings.maxNestedDepth || 2)
          }
          
          if (data.seoSettings) {
            setMetaKeywords(data.seoSettings.metaKeywords || "")
            setMetaDescription(data.seoSettings.metaDescription || "")
            setEnableSitemap(data.seoSettings.enableSitemap ?? true)
            setEnableRSS(data.seoSettings.enableRSS ?? true)
          }
          
          if (data.otherSettings) {
            setPostsPerPage(data.otherSettings.postsPerPage || 10)
            setEnableDarkMode(data.otherSettings.enableDarkMode ?? true)
          }
        }
      } catch (error) {
        console.error("加载设置失败:", error)
      } finally {
        setLoadingData(false)
      }
    }
    
    loadSettings()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSaveSuccess(false)
    
    try {
      const settingsData: Record<string, any> = {
        siteInfo: {
          siteName,
          siteDescription,
          siteUrl,
          authorName,
          authorEmail,
        },
        commentSettings: {
          commentDefaultStatus,
          commentsPerPage,
          enableNestedComments,
          maxNestedDepth,
        },
        seoSettings: {
          metaKeywords,
          metaDescription,
          enableSitemap,
          enableRSS,
        },
        otherSettings: {
          postsPerPage,
          enableDarkMode,
        },
      }
      
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      })
      
      if (!response.ok) {
        throw new Error("保存失败")
      }
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error("保存设置失败:", error)
      alert("保存失败，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">系统设置</h1>
        <div className="text-center py-12 text-muted-foreground">
          <p>加载设置中...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">系统设置</h1>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "保存中..." : saveSuccess ? "✓ 已保存" : "保存设置"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* 站点基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              站点基本信息
            </CardTitle>
            <CardDescription>配置网站的基本信息和显示名称</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">站点名称</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="个人博客"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">站点描述</Label>
              <Textarea
                id="siteDescription"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="简短描述您的博客..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteUrl">站点URL</Label>
              <Input
                id="siteUrl"
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="authorName">作者名称</Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="管理员"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authorEmail">作者邮箱</Label>
              <Input
                id="authorEmail"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* 评论设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              评论设置
            </CardTitle>
            <CardDescription>配置评论功能的默认行为和显示选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>评论默认状态</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="commentStatus"
                    value="APPROVED"
                    checked={commentDefaultStatus === "APPROVED"}
                    onChange={(e) => setCommentDefaultStatus(e.target.value as "APPROVED" | "PENDING")}
                    className="w-4 h-4"
                  />
                  <span>默认通过（无需审核）</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="commentStatus"
                    value="PENDING"
                    checked={commentDefaultStatus === "PENDING"}
                    onChange={(e) => setCommentDefaultStatus(e.target.value as "APPROVED" | "PENDING")}
                    className="w-4 h-4"
                  />
                  <span>待审核（需要管理员审核）</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commentsPerPage">每页评论数</Label>
              <Input
                id="commentsPerPage"
                type="number"
                min="5"
                max="50"
                value={commentsPerPage}
                onChange={(e) => setCommentsPerPage(parseInt(e.target.value) || 10)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用嵌套回复</Label>
                <p className="text-sm text-muted-foreground">允许评论的回复功能</p>
              </div>
              <Switch
                checked={enableNestedComments}
                onCheckedChange={setEnableNestedComments}
              />
            </div>
            {enableNestedComments && (
              <div className="space-y-2">
                <Label htmlFor="maxNestedDepth">最大嵌套深度</Label>
                <Input
                  id="maxNestedDepth"
                  type="number"
                  min="1"
                  max="5"
                  value={maxNestedDepth}
                  onChange={(e) => setMaxNestedDepth(parseInt(e.target.value) || 2)}
                />
                <p className="text-xs text-muted-foreground">评论最多可以嵌套回复的层数</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEO设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO设置
            </CardTitle>
            <CardDescription>配置搜索引擎优化相关设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta关键词</Label>
              <Input
                id="metaKeywords"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                placeholder="关键词1, 关键词2, 关键词3"
              />
              <p className="text-xs text-muted-foreground">多个关键词用逗号分隔</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta描述</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="网站的描述信息，用于SEO..."
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用Sitemap</Label>
                <p className="text-sm text-muted-foreground">自动生成网站地图</p>
              </div>
              <Switch
                checked={enableSitemap}
                onCheckedChange={setEnableSitemap}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用RSS订阅</Label>
                <p className="text-sm text-muted-foreground">提供RSS订阅源</p>
              </div>
              <Switch
                checked={enableRSS}
                onCheckedChange={setEnableRSS}
              />
            </div>
          </CardContent>
        </Card>

        {/* 其他设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              其他设置
            </CardTitle>
            <CardDescription>配置其他系统选项</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="postsPerPage">每页文章数</Label>
              <Input
                id="postsPerPage"
                type="number"
                min="5"
                max="50"
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(parseInt(e.target.value) || 10)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>启用暗色模式</Label>
                <p className="text-sm text-muted-foreground">允许用户切换主题</p>
              </div>
              <Switch
                checked={enableDarkMode}
                onCheckedChange={setEnableDarkMode}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
