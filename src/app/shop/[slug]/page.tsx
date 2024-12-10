import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ProductImage from '@/components/shop/product-image';
import ProductPricing from '@/components/shop/product-pricing';
import Link from 'next/link';
import { getProductBySlug, generateSlug } from '@/services/api';

interface Props {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generate metadata for the page
export async function generateMetadata(
  { params, searchParams }: Props,
): Promise<Metadata> {
  const slug = params.slug;
  
  if (!slug) {
    return { title: 'Product - Pinewraps' };
  }

  try {
    const product = await getProductBySlug(slug);
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

export default async function ProductPage({ params, searchParams }: Props) {
  const slug = params.slug;
  
  if (!slug) {
    notFound();
  }

  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      notFound();
    }

    // Verify the slug matches the current product name
    // If it doesn't match, redirect to the correct URL for SEO
    const correctSlug = generateSlug(product.name);
    if (slug !== correctSlug) {
      redirect(`/shop/${correctSlug}`);
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
    notFound();
  }
}
