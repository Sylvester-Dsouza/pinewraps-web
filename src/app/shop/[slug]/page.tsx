import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductImage from '@/components/shop/product-image';
import ProductPricing from '@/components/shop/product-pricing';
import Link from 'next/link';
import { getProductBySlug } from '@/services/api';

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
      return { title: 'Product - PineWraps' };
    }

    return {
      title: `${product.name} - PineWraps`,
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
      title: 'Product - PineWraps',
    };
  }
}

// Product page component
export default async function ProductPage({ params }: PageProps) {
  try {
    const slug = params.slug;
    
    if (!slug) {
      return notFound();
    }

    const response = await getProductBySlug(slug);

    if (!response?.data) {
      console.error('Product not found:', slug);
      return notFound();
    }

    const product = response.data;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li>
              <Link href="/shop" className="text-gray-500 hover:text-gray-700">Shop</Link>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square">
            <ProductImage
              images={product.images || [{ url: '/placeholder.jpg' }]}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="mt-4 text-gray-600">{product.description}</p>
            </div>

            <ProductPricing 
              basePrice={product.basePrice}
              variations={product.variations || []}
              combinations={typeof product.variantCombinations === 'string' 
                ? JSON.parse(product.variantCombinations || '[]')
                : product.variantCombinations || []}
              productId={product.id}
              productName={product.name}
              imageUrl={product.images?.[0]?.url || '/placeholder.jpg'}
              isCake={product.category?.name?.toLowerCase() === 'cakes'}
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
