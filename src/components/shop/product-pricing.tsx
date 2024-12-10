'use client';

import { useState } from 'react';
import DynamicPrice from '@/components/shop/dynamic-price';
import ProductCakeWriting from '@/components/shop/product-cake-writing';
import AddToCartButton from '@/components/shop/add-to-cart-button';

interface ProductPricingProps {
  basePrice: number;
  variations: any[];
  combinations: Array<{
    size: string;
    flavour: string;
    price: number;
  }>;
  productId: string;
  productName: string;
  imageUrl: string;
  isCake: boolean;
}

export default function ProductPricing({
  basePrice,
  variations,
  combinations = [],
  productId,
  productName,
  imageUrl,
  isCake,
}: ProductPricingProps) {
  const [selectedPrice, setSelectedPrice] = useState(basePrice);
  const [selectedVariations, setSelectedVariations] = useState<Array<{
    type: string;
    value: string;
    priceAdjustment: number;
  }>>([]);
  const [cakeWriting, setCakeWriting] = useState('');

  return (
    <div className="space-y-6">
      <DynamicPrice
        basePrice={basePrice}
        variations={variations}
        combinations={combinations}
        onPriceChange={setSelectedPrice}
        onVariationsChange={setSelectedVariations}
      />

      {/* Cake Writing Input */}
      {isCake && (
        <div className="py-4">
          <ProductCakeWriting onChange={setCakeWriting} />
        </div>
      )}

      {/* Add to Cart Section */}
      <div className="pt-4">
        <AddToCartButton
          productId={productId}
          name={productName}
          selectedPrice={selectedPrice}
          imageUrl={imageUrl}
          selectedVariations={selectedVariations}
          cakeWriting={isCake ? cakeWriting : undefined}
        />
      </div>
    </div>
  );
}
