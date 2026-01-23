interface ReadingTimeOptions {
  /** 中文每分钟阅读字数，默认 300 */
  chineseWordsPerMinute?: number
  /** 英文每分钟阅读单词数，默认 200 */
  englishWordsPerMinute?: number
}

/**
 * 计算文章阅读时间
 * @param content 文章内容（Markdown 或纯文本）
 * @param options 阅读速度配置
 * @returns 预计阅读时间（分钟）
 */
export function calculateReadingTime(
  content: string,
  options: ReadingTimeOptions = {}
): number {
  if (!content) return 0

  const { chineseWordsPerMinute = 300, englishWordsPerMinute = 200 } = options

  // 移除 Markdown 语法
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`[^`]*`/g, "") // 移除行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 移除链接，保留文本
    .replace(/[#*_~>-]/g, "") // 移除 Markdown 符号
    .replace(/\n+/g, " ") // 换行转空格
    .trim()

  // 计算中文字数
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length

  // 计算英文单词数
  const englishWords = plainText
    .replace(/[\u4e00-\u9fa5]/g, "") // 移除中文
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  // 根据配置计算阅读时间
  const chineseMinutes = chineseChars / chineseWordsPerMinute
  const englishMinutes = englishWords / englishWordsPerMinute

  const totalMinutes = chineseMinutes + englishMinutes

  // 至少 1 分钟
  return Math.max(1, Math.ceil(totalMinutes))
}

/**
 * 格式化阅读时间显示
 * @param minutes 分钟数
 * @returns 格式化的字符串
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "不到 1 分钟"
  if (minutes === 1) return "1 分钟阅读"
  return `${minutes} 分钟阅读`
}
