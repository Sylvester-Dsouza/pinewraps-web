'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTitle from '@/components/ui/page-title';
import { Product } from '@/types/product';
import { getProductPrice } from '@/utils/product';
import { formatPrice } from '@/utils/format';

export default function SetsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First, get the category ID for Sets
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/public`,
          { cache: 'no-store' }
        );
        
        if (!categoryRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoryData = await categoryRes.json();
        const setsCategory = categoryData.data.find((cat: any) => cat.name === 'Sets');

        if (!setsCategory) {
          console.error('Available categories:', categoryData.data);
          throw new Error('Sets category not found');
        }

        // Then fetch products for this category
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/public?categoryId=${setsCategory.id}&status=ACTIVE`,
          { 
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!productsRes.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsRes.json();
        // Filter products to only show those in the Sets category
        const setProducts = productsData.data.filter((product: any) => 
          product.category?.id === setsCategory.id
        );
        setProducts(setProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PageTitle 
        title="Perfect Combinations" 
        description="The best of both worlds - cakes and flowers"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed">
            Experience the magic of perfect pairings with Pinewraps&apos; sets collection. We&apos;ve thoughtfully 
            combined our handcrafted cakes with stunning flower arrangements to create unforgettable gift packages. 
            Each set is designed to make your celebrations more special, offering a harmonious blend of flavors 
            and visual beauty. Whether it&apos;s a birthday, anniversary, or any special occasion, our sets provide 
            a complete celebration solution that will leave a lasting impression.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
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
                    return price.max ? `${formatPrice(price.min)} - ${formatPrice(price.max)}` : formatPrice(price.min);
                  })()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No sets available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
