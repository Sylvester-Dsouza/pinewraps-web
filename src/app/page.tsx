import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/layout/navbar'
import { Product } from '@/types/product'
import { getProductPrice } from '@/utils/product'
import { formatPrice } from '@/utils/format'

// Add this async function to fetch products
async function getNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/public?limit=8&sort=createdAt:desc`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data.data || []; // Updated to handle the correct response structure
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export const revalidate = 3600; // Revalidate the page every hour

export default async function Home() {
  // Fetch new arrivals
  const newArrivals = await getNewArrivals();

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Pinewraps Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
              Pine Wraps for Special Moments
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              Discover our exquisite collection of handcrafted cakes, fresh flowers, and perfect combinations for your celebrations.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/shop">
                <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-w-[120px]">
                  View Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cakes Category */}
            <Link href="/cakes" className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/category-cakes.jpg"
                  alt="Luxury Cakes Collection"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white">Cakes</h3>
                  <p className="text-white/90 mt-2">Handcrafted with love</p>
                </div>
              </div>
            </Link>

            {/* Flowers Category */}
            <Link href="/flowers" className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/category-flowers.jpg"
                  alt="Fresh Flowers Collection"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white">Flowers</h3>
                  <p className="text-white/90 mt-2">Fresh daily blooms</p>
                </div>
              </div>
            </Link>

            {/* Sets Category */}
            <Link href="/sets" className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src="/images/category-sets.jpg"
                  alt="Perfect Combinations"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white">Sets</h3>
                  <p className="text-white/90 mt-2">Perfect combinations</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">New Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {newArrivals.map((product) => (
                <Link key={product.id} href={`/shop/${product.slug}`} className="group">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <Image
                      src={product.images?.[0]?.url || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-gray-500">
                    {(() => {
                      const price = getProductPrice(product);
                      return price.max 
                        ? `${formatPrice(price.min)} - ${formatPrice(price.max)}` 
                        : formatPrice(price.min);
                    })()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
