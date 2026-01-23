import { Skeleton } from "@/components/ui/skeleton"

function PostCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-10">
        <Skeleton className="h-6 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-10 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-32 mx-auto" />
      </div>
      
      {/* Post Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
