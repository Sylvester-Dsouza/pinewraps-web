'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CheckoutErrorPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const message = searchParams.get('message') || 'An error occurred during checkout';

  useEffect(() => {
    // Clear cart on error
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {message}
        </p>

        <div className="space-y-4">
          <Link
            href="/checkout"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Link>
          
          <div>
            <Link
              href="/contact"
              className="inline-block text-gray-600 hover:text-gray-900 mt-4"
            >
              Need help? Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
