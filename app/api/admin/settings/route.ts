import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

export async function GET() {
  try {
    await requireAdmin()

    // 获取所有设置
    const settings = await prisma.setting.findMany()
    
    // 转换为对象格式
    const settingsObj: Record<string, any> = {}
    settings.forEach(setting => {
      try {
        settingsObj[setting.id] = JSON.parse(setting.value)
      } catch {
        settingsObj[setting.id] = setting.value
      }
    })

    return NextResponse.json(settingsObj)
  } catch (error) {
    console.error("获取设置错误:", error)
    return NextResponse.json(
      { error: "获取设置失败" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()

    // 批量保存设置，每个顶级key作为一个设置项
    const updates = Object.entries(body).map(([key, value]) => {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
      return prisma.setting.upsert({
        where: { id: key },
        update: { value: stringValue },
        create: { id: key, value: stringValue },
      })
    })

    await Promise.all(updates)

    return NextResponse.json({ message: "设置已保存" })
  } catch (error) {
    console.error("保存设置错误:", error)
    return NextResponse.json(
      { error: "保存设置失败" },
      { status: 500 }
    )
  }
}
