'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageTitle from '@/components/ui/page-title';
import { Product } from '@/types/product';
import { getProductPrice } from '@/utils/product';
import { formatPrice } from '@/utils/format';

export default function CakesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First, get the category ID for Cakes
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories/public`,
          { cache: 'no-store' }
        );
        
        if (!categoryRes.ok) {
          throw new Error('Failed to fetch categories');
        }

        const categoryData = await categoryRes.json();
        const cakesCategory = categoryData.data.find((cat: any) => cat.name === 'Cakes');

        if (!cakesCategory) {
          throw new Error('Cakes category not found');
        }

        // Then fetch products for this category
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/public?categoryId=${cakesCategory.id}&status=ACTIVE`,
          { cache: 'no-store' }
        );
        
        if (!productsRes.ok) {
          throw new Error('Failed to fetch products');
        }

        const productsData = await productsRes.json();
        // Filter products to only show those in the Cakes category
        const cakeProducts = productsData.data.filter((product: any) => 
          product.category?.id === cakesCategory.id
        );
        setProducts(cakeProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PageTitle 
        title="Luxury Cakes Collection" 
        description="Handcrafted with love and premium ingredients"
      />

      {/* Category Description for SEO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose max-w-none">
          <p className="text-gray-600 text-lg leading-relaxed">
            Welcome to Pinewraps&apos; exclusive cake collection. Each cake in our collection is a masterpiece, 
            handcrafted with premium ingredients and meticulous attention to detail. Whether you&apos;re celebrating 
            a birthday, wedding, or any special occasion, our luxury cakes are designed to make your moment 
            unforgettable. From classic flavors to innovative creations, discover the perfect cake that matches 
            your taste and style.
          </p>
        </div>
      </div>

      {/* Products Grid */}
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
            <p className="text-gray-500">No cakes available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
