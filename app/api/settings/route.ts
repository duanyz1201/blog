import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// 公开的API，不需要认证
export async function GET() {
  try {
    // 获取站点设置
    const settings = await prisma.setting.findUnique({
      where: { id: "siteInfo" },
    })
    
    if (!settings) {
      // 如果没有设置，返回默认值
      return NextResponse.json({
        siteName: "个人博客",
        siteDescription: "",
        siteUrl: "",
        authorName: "管理员",
        authorEmail: "",
      })
    }

    try {
      const siteInfo = JSON.parse(settings.value)
      return NextResponse.json({
        siteName: siteInfo.siteName || "个人博客",
        siteDescription: siteInfo.siteDescription || "",
        siteUrl: siteInfo.siteUrl || "",
        authorName: siteInfo.authorName || "管理员",
        authorEmail: siteInfo.authorEmail || "",
      })
    } catch {
      // 如果解析失败，返回默认值
      return NextResponse.json({
        siteName: "个人博客",
        siteDescription: "",
        siteUrl: "",
        authorName: "管理员",
        authorEmail: "",
      })
    }
  } catch (error) {
    console.error("获取站点设置错误:", error)
    // 出错时返回默认值
    return NextResponse.json({
      siteName: "个人博客",
      siteDescription: "",
      siteUrl: "",
      authorName: "管理员",
      authorEmail: "",
    })
  }
}
