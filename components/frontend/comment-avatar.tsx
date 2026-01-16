// 基于用户名或邮箱生成稳定的种子值
function generateSeed(str: string): string {
  if (!str) return "default"
  return str.toLowerCase().trim().replace(/\s+/g, "-")
}

// 生成动漫风格头像URL
function generateAnimeAvatarUrl(seed: string, size: number = 80): string {
  // 使用 DiceBear Avatars 的 Anime 风格
  // 基于 seed 生成稳定的随机头像
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&size=${size}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
  return avatarUrl
}

export function CommentAvatar({ 
  name, 
  email,
  size = 40 
}: { 
  name: string
  email?: string
  size?: number 
}) {
  // 使用邮箱优先，如果没有则使用用户名
  const seed = generateSeed(email || name || "anonymous")
  const avatarUrl = generateAnimeAvatarUrl(seed, size * 2) // DiceBear 使用更大的尺寸以获得更好的质量
  
  return (
    <div
      className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      title={name || email}
    >
      <img
        src={avatarUrl}
        alt={name || email || "头像"}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  )
}
