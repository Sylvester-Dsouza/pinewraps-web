'use client';

import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import CartItem from '@/components/cart/cart-item';
import CartSummary from '@/components/cart/cart-summary';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const isEmpty = state.items.length === 0;

  const handleCheckout = () => {
    if (!user) {
      // Save current URL as return URL
      router.push(`/auth/login?returnUrl=${encodeURIComponent('/checkout')}`);
    } else {
      router.push('/checkout');
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Start adding some items to your cart!
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {state.items.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/shop"
                className="text-sm font-medium text-black hover:text-gray-700"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          <div className="mt-16 rounded-lg lg:col-span-5 lg:mt-0">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      </div>
    </div>
  );
}
