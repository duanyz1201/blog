import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
      {/* Title */}
      <Skeleton className="h-10 w-32 mx-auto mb-2" />
      <Skeleton className="h-5 w-64 mx-auto mb-8" />
      
      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-10">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      
      {/* Results */}
      <div className="max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
