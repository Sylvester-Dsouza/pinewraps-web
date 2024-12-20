const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
}

export interface ProductVariation {
  id: string;
  type: 'SIZE' | 'FLAVOUR';
  options: {
    id: string;
    value: string;
    priceAdjustment: number;
    stock: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  status: 'ACTIVE' | 'DRAFT';
  basePrice: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  images: ProductImage[];
  variations: ProductVariation[];
  variantCombinations: string;
}

export async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products/public/`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const result: ApiResponse<Product[]> = await response.json();
    if (!result.success) {
      throw new Error('Failed to fetch products');
    }
    // Filter only ACTIVE products
    return result.data.filter(product => product.status === 'ACTIVE');
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Helper function to generate SEO-friendly slug
export function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to find product by slug
export const getProductBySlug = async (slug: string) => {
  try {
    const response = await fetch(`${API_URL}/api/products/public/${slug}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return { data: null };
  }
};

export async function getProductById(id: string) {
  try {
    const response = await fetch(`${API_URL}/api/products/public/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const result: ApiResponse<Product> = await response.json();
    if (!result.success) {
      throw new Error('Failed to fetch product');
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Helper function to format price in AED
export function formatPrice(price: number): string {
  return `${price} AED`;
}
