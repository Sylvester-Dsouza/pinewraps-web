'use client';

import { useCart } from '@/contexts/cart-context';
import { ShoppingBag } from 'lucide-react';

export default function CartIcon() {
  const { state } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative inline-flex items-center">
      <ShoppingBag className="h-6 w-6 text-gray-700 hover:text-black transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center font-medium">
          {itemCount}
        </span>
      )}
    </div>
  );
}
