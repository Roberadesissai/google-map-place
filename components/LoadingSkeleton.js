export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Hero Section Skeleton */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gray-200 animate-pulse rounded-lg">
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="h-8 w-2/3 bg-gray-300 rounded" />
          <div className="flex gap-4">
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
          </div>
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <div className="h-10 w-24 bg-gray-200 rounded-md inline-block" />
          <div className="h-10 w-24 bg-gray-200 rounded-md inline-block" />
          <div className="h-10 w-24 bg-gray-200 rounded-md inline-block" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-md" />
          <div className="h-10 w-10 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* Map Skeleton */}
      <div className="h-[300px] bg-gray-200 rounded-lg" />
    </div>
  )
} 