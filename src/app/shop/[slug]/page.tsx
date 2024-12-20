import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ProductImage from '@/components/shop/product-image';
import ProductPricing from '@/components/shop/product-pricing';
import Link from 'next/link';
import { getProductBySlug, generateSlug } from '@/services/api';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  try {
    const response = await getProductBySlug(params.slug);
    const product = response?.data;

    if (!product) {
      return { title: 'Product - Pinewraps' };
    }

    return {
      title: `${product.name} - Pinewraps`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product - Pinewraps',
    };
  }
}

// Product page component
export default async function ProductPage({ params, searchParams }: PageProps) {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return notFound();
    }

    const response = await getProductBySlug(slug);
    
    if (!response?.data) {
      return notFound();
    }

    const product = response.data;
    
    // Generate the correct slug from the product name
    const correctSlug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // If current slug doesn't match the product name slug and we're not already redirecting
    if (correctSlug !== slug && !searchParams?.redirect) {
      // Use window.history to update the URL without a full page reload
      const newUrl = `/shop/${correctSlug}?redirect=true`;
      return redirect(new URL(newUrl, 'http://localhost:3000'), 307);
    }

    const variations = product.variations || [];
    const isCake = product.category.name.toLowerCase() === 'cakes';

    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/shop" className="text-gray-500 hover:text-gray-700">
                Shop
              </Link>
            </li>
            <li>
              <span className="text-gray-400 mx-2">/</span>
            </li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="relative aspect-square">
            <ProductImage images={product.images} />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-4 text-gray-600">{product.description}</p>
            </div>

            <ProductPricing
              basePrice={product.basePrice}
              variations={variations}
              combinations={JSON.parse(product.variantCombinations?.toString() || '[]')}
              productId={product.id}
              productName={product.name}
              imageUrl={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || ''}
              isCake={isCake}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    return notFound();
  }
}
