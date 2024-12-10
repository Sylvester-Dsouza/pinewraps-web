'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';

interface RewardUpdate {
  points: number;
  tier: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [rewardUpdate, setRewardUpdate] = useState<RewardUpdate | null>(null);
  const orderId = searchParams.get('orderId');
  const ref = searchParams.get('ref');

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const fetchRewardUpdate = async () => {
      if (!orderId || !user?.customerId) return;

      try {
        const response = await fetch(`/api/rewards/${user.customerId}`);
        if (!response.ok) return;
        
        const data = await response.json();
        setRewardUpdate(data.data);
      } catch (error) {
        console.error('Error fetching reward update:', error);
      }
    };

    fetchRewardUpdate();
  }, [orderId, user?.customerId]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank you for your order!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We've received your order #{orderId} and will begin processing it right away.
          <br />
          You'll receive a confirmation email shortly.
        </p>

        {rewardUpdate && (
          <div className="bg-primary/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Rewards Update</h2>
            <p className="text-gray-600">
              You now have {rewardUpdate.points} points
              {rewardUpdate.tier && ` and are at ${rewardUpdate.tier} tier`}!
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/account/orders"
            className="inline-block bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
          >
            View Order Status
          </Link>
          
          <div>
            <Link
              href="/"
              className="inline-block text-gray-600 hover:text-gray-900 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
