'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { ProductVariation } from '@/types/product';
import { formatPrice } from '@/services/api';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  selectedPrice: number;
  imageUrl?: string;
  selectedVariations: ProductVariation[];
  cakeWriting?: string;
}

export default function AddToCartButton({
  productId,
  name,
  selectedPrice,
  imageUrl,
  selectedVariations = [],
  cakeWriting,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const totalPrice = selectedPrice * quantity;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // Get both size and flavor variants
      const sizeVariant = selectedVariations.find(v => v.type === 'SIZE')?.value || '';
      const flavorVariant = selectedVariations.find(v => v.type === 'FLAVOUR')?.value || '';
      
      // Combine size and flavor into a single variant string
      const mainVariant = [sizeVariant, flavorVariant].filter(Boolean).join(' - ');
      
      await addItem({
        id: productId,
        name,
        price: selectedPrice,
        quantity,
        imageUrl,
        variant: mainVariant,
        selectedVariations,
        cakeWriting,
      });
      router.push('/cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-white">
        <button
          type="button"
          className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={isAdding}
        >
          <span className="text-lg">−</span>
        </button>
        <span className="w-8 text-center font-medium text-gray-900">
          {quantity}
        </span>
        <button
          type="button"
          className="w-8 h-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          onClick={() => setQuantity(Math.min(10, quantity + 1))}
          disabled={isAdding}
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex-1 bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
        <span className="text-gray-300">{formatPrice(totalPrice)}</span>
      </button>
    </div>
  );
}
