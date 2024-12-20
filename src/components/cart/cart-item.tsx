'use client';

import Image from 'next/image';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem as CartItemType } from '@/contexts/cart-context';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(10, item.quantity + delta));
    if (newQuantity !== item.quantity) {
      onUpdateQuantity(item.cartItemId!, newQuantity);
    }
  };

  return (
    <div className="py-6 flex">
      <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between">
            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
            <p className="ml-4 text-base font-medium text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
          {item.selectedVariations && item.selectedVariations.length > 0 && (
            <div className="mt-1 space-y-1">
              {item.selectedVariations
                .filter(variation => variation.value)
                .map((variation, index) => (
                <p key={`${item.cartItemId}-variation-${index}`} className="text-sm text-gray-500">
                  {variation.type}: {variation.value}
                </p>
              ))}
            </div>
          )}
          {item.cakeWriting && (
            <p className="mt-1 text-sm text-gray-500">Writing: {item.cakeWriting}</p>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.cartItemId!)}
            className="text-sm font-medium text-black hover:text-gray-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
