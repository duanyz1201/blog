import { CommentsList } from "./comments-list"
import { prisma } from "@/lib/db"

async function getComments() {
  try {
    const page = 1
    const limit = 20
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          post: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.comment.count(),
    ])

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("获取评论列表错误:", error)
    return {
      comments: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }
  }
}

export default async function CommentsPage() {
  const { comments } = await getComments()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">评论管理</h1>
      <CommentsList comments={comments} />
    </div>
  )
}
