export interface ProductImage {
  id?: string;
  url?: string;
  downloadURL?: string;
  alt?: string | null;
  isPrimary?: boolean;
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
  status: 'ACTIVE' | 'INACTIVE';
  basePrice: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  categoryId: string;
  variantCombinations: any[];
  category: {
    id: string;
    name: string;
  };
  images: ProductImage[];
  variations: ProductVariation[];
}
