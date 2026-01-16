import { format, formatDistanceToNow, isToday, isYesterday, isThisYear } from "date-fns"
import { zhCN } from "date-fns/locale"

/**
 * 格式化日期为中文格式
 * @param date 日期对象或字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  
  if (isToday(dateObj)) {
    return "今天"
  }
  
  if (isYesterday(dateObj)) {
    return "昨天"
  }
  
  if (isThisYear(dateObj)) {
    return format(dateObj, "M月d日", { locale: zhCN })
  }
  
  return format(dateObj, "yyyy年M月d日", { locale: zhCN })
}

/**
 * 格式化相对时间（中文）
 * @param date 日期对象或字符串
 * @returns 相对时间字符串（如：刚刚、1分钟前、1小时前、1天前）
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return "刚刚"
  }
  
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  }
  
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  }
  
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  }
  
  // 超过一周，使用 formatDistanceToNow
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: zhCN 
  }).replace("大约 ", "").replace("内", "前")
}

/**
 * 格式化完整日期时间
 * @param date 日期对象或字符串
 * @returns 完整日期时间字符串
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "yyyy年M月d日 HH:mm", { locale: zhCN })
}
