import PageTitle from "@/components/ui/page-title"

export default function Loading() {
  return (
    <div>
      <PageTitle 
        title="Shop" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" }
        ]} 
      />

      <div className="container mx-auto px-4 py-12">
        {/* Filters Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-4">
            <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-40 h-10 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-md animate-pulse"></div>
              <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex justify-between">
                <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
