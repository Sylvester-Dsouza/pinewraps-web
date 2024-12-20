'use client';

import { useState, useEffect } from 'react';
import PageTitle from "@/components/ui/page-title";
import Link from "next/link";
import { getProducts, formatPrice } from "@/services/api";
import { Product } from "@/types/product";
import ProductGridImage from "@/components/shop/product-grid-image";
import ErrorMessage from "@/components/shop/error-message";
import ProductFilters from "@/components/shop/product-filters";

function getProductPrice(product: Product): { min: number; max: number | null } {
  // If no variations, return base price
  if (!product.variations || product.variations.length === 0) {
    return { min: product.basePrice, max: null };
  }

  // First check for variant combinations
  try {
    const combinations = typeof product.variantCombinations === 'string' 
      ? JSON.parse(product.variantCombinations || '[]')
      : product.variantCombinations || [];

    if (Array.isArray(combinations) && combinations.length > 0) {
      const combinationPrices = combinations
        .map(combo => combo.price)
        .filter(price => typeof price === 'number');

      if (combinationPrices.length > 0) {
        return {
          min: Math.min(...combinationPrices),
          max: combinationPrices.length > 1 ? Math.max(...combinationPrices) : null
        };
      }
    }
  } catch (e) {
    console.error('Error parsing variant combinations:', e);
  }

  // If no valid combination prices, fall back to single variation prices
  const allPrices: number[] = [];
  product.variations.forEach(variation => {
    variation.options.forEach(option => {
      if (typeof option.priceAdjustment === 'number') {
        allPrices.push(option.priceAdjustment);
      }
    });
  });

  // If no valid prices found, return base price
  if (allPrices.length === 0) {
    return { min: product.basePrice, max: null };
  }

  // Return min and max prices from single variations
  return {
    min: Math.min(...allPrices),
    max: allPrices.length > 1 ? Math.max(...allPrices) : null
  };
}

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFiltersChange = ({ category, sort }: { category: string; sort: string }) => {
    let filtered = [...products];

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category?.name === category);
    }

    // Apply sorting
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => getProductPrice(a).min - getProductPrice(b).min);
        break;
      case 'price-desc':
        filtered.sort((a, b) => getProductPrice(b).min - getProductPrice(a).min);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        // 'featured' - no sorting needed, keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <PageTitle 
        title="Shop" 
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" }
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <ProductFilters products={products} onFiltersChange={handleFiltersChange} />

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products found.</p>
              </div>
            ) : (
              filteredProducts.map((product: Product) => {
                if (!product) return null;
                
                const price = getProductPrice(product);
                const imageUrl = product.images?.[0]?.url || product.images?.[0]?.downloadURL || '/placeholder.jpg';
                const imageAlt = product.images?.[0]?.alt || product.name || 'Product image';
                
                return (
                  <div key={product.id} className="group">
                    <Link href={`/shop/${product.slug}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4 rounded-lg">
                        <ProductGridImage
                          src={imageUrl}
                          alt={imageAlt}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold line-clamp-2">{product.name || 'Unnamed Product'}</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-900">
                            {formatPrice(price.min)}
                            {price.max !== null && price.max !== price.min ? ` - ${formatPrice(price.max)}` : ''}
                          </span>
                          <span className="text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
