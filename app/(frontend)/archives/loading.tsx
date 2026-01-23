import { Skeleton } from "@/components/ui/skeleton"

export default function ArchivesLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-300">
      {/* Title */}
      <Skeleton className="h-10 w-32 mx-auto mb-2" />
      <Skeleton className="h-5 w-48 mx-auto mb-10" />
      
      {/* Timeline */}
      <div className="max-w-3xl mx-auto space-y-8">
        {Array.from({ length: 3 }).map((_, yearIndex) => (
          <div key={yearIndex}>
            {/* Year */}
            <Skeleton className="h-8 w-20 mb-6" />
            
            {/* Months */}
            <div className="space-y-6 ml-4 border-l-2 border-border pl-6">
              {Array.from({ length: 2 }).map((_, monthIndex) => (
                <div key={monthIndex}>
                  <Skeleton className="h-6 w-16 mb-4" />
                  
                  {/* Posts */}
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, postIndex) => (
                      <div key={postIndex} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-64" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
