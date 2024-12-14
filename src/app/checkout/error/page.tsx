'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useCart } from '@/contexts/cart-context';

function CheckoutErrorContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const message = searchParams.get('message') || 'An error occurred during checkout';
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  const ref = searchParams.get('ref');

  useEffect(() => {
    // Clear cart on error
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {status === 'CANCELLED' ? 'Payment Cancelled' : 'Payment Failed'}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {message}
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            Order Reference: #{orderId}
          </p>
        )}

        <div className="space-y-4">
          <Link
            href="/checkout"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Link>
          
          <div className="flex flex-col space-y-2">
            <Link
              href="/contact"
              className="inline-block text-gray-600 hover:text-gray-900"
            >
              Need help? Contact support
            </Link>
            <Link
              href="/cart"
              className="inline-block text-gray-600 hover:text-gray-900"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      }
    >
      <CheckoutErrorContent />
    </Suspense>
  );
}
