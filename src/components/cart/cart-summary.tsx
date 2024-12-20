'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const router = useRouter();
  const { state } = useCart();
  const total = state.total;

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      
      <div className="mt-6">
        <div className="flex items-center justify-between text-lg">
          <p className="font-medium text-gray-900">Total</p>
          <p className="font-semibold text-gray-900">{formatPrice(total)}</p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        className="mt-6 w-full rounded-xl bg-black py-4 px-6 text-base font-medium text-white shadow-sm hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2 group"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Shipping calculated at checkout
      </p>
    </div>
  );
}
