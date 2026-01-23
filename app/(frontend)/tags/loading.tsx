import { Skeleton } from "@/components/ui/skeleton"

export default function TagsLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
      {/* Title */}
      <Skeleton className="h-10 w-32 mx-auto mb-2" />
      <Skeleton className="h-5 w-48 mx-auto mb-10" />
      
      {/* Tags Cloud */}
      <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="h-8 rounded-full" 
            style={{ width: `${60 + Math.random() * 60}px` }}
          />
        ))}
      </div>
    </div>
  )
}
