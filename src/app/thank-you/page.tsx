'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PaymentService } from '@/services/payment.service';

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const ref = searchParams.get('ref');
        const status = searchParams.get('status');
        const orderId = searchParams.get('orderId');

        if (!ref || status !== 'success') {
          console.error('Invalid payment reference or status');
          router.push('/');
          return;
        }

        // Get order details using the payment reference
        const details = await PaymentService.getPaymentDetails(ref);
        console.log('Order Details:', details); // Debug log
        
        if (details && details.orderId) {
          setOrderDetails(details);
        } else {
          console.error('No order details found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Your order has been successfully placed and confirmed.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">Order ID: {orderDetails.orderId}</p>
                <p className="text-gray-600">
                  Total Amount: AED {orderDetails.amount?.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">What's Next?</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-gray-600">
                  1. You will receive an order confirmation email shortly.
                </p>
                <p className="text-gray-600">
                  2. You can track your order status in your account.
                </p>
                <p className="text-gray-600">
                  3. We will notify you when your order is ready.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account/orders">
              <Button variant="default" className="w-full sm:w-auto">
                View Order
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
