import { Skeleton } from "@/components/ui/skeleton"

export default function PostLoading() {
  return (
    <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <header className="mb-12">
        {/* Category */}
        <Skeleton className="h-6 w-16 rounded-full mb-6" />
        
        {/* Title */}
        <Skeleton className="h-12 w-full mb-3" />
        <Skeleton className="h-12 w-2/3 mb-6" />
        
        {/* Meta */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-2 pt-4 border-t">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </header>

      {/* Content */}
      <div className="space-y-4 mb-12">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
      </div>

      {/* Navigation */}
      <div className="border-t pt-8 mt-12">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Comments */}
      <div className="mt-12">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </article>
  )
}
