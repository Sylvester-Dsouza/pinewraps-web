import { Button } from "@/components/ui/button"
import PageTitle from "@/components/ui/page-title"
import Link from "next/link"

const wishlistItems = [
  {
    id: 1,
    name: "Chocolate Truffle Cake",
    price: 599,
    category: "Cakes",
    image: "/placeholder.jpg",
    inStock: true,
  },
  {
    id: 2,
    name: "Red Rose Bouquet",
    price: 399,
    category: "Flowers",
    image: "/placeholder.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "Vanilla Bean Cake",
    price: 549,
    category: "Cakes",
    image: "/placeholder.jpg",
    inStock: false,
  },
]

export default function WishlistPage() {
  return (
    <div>
      <PageTitle 
        title="My Wishlist" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" },
        ]} 
      />

      <div className="container mx-auto px-4 py-12">
        {wishlistItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <Link href={`/shop/${item.id}`}>
                    <div className="aspect-square bg-gray-100 relative group">
                      <div className="absolute inset-0 bg-black/[0.03] group-hover:bg-black/[0.05] transition-colors" />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="mb-4">
                      <Link href={`/shop/${item.id}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      <p className="font-semibold mt-1">₹{item.price}</p>
                    </div>

                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        disabled={!item.inStock}
                      >
                        Add to Cart
                      </Button>
                      <button className="w-full text-sm text-gray-600 hover:text-black">
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className="bg-white text-black border border-black hover:bg-gray-100">
                Continue Shopping
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
            <p className="mt-1 text-sm text-gray-500">Start adding items you like to your wishlist.</p>
            <div className="mt-6">
              <Button>
                Browse Products
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
