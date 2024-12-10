'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PaymentService } from '@/services/payment.service';

export default function ThankYouPage() {
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
        <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 text-lg mb-8">
            Your order has been successfully placed and will be processed shortly.
          </p>

          {/* Order Details */}
          {orderDetails && (
            <div className="text-left mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><span className="font-medium">Order Number:</span> {orderDetails.orderNumber}</p>
                <p><span className="font-medium">Amount:</span> AED {orderDetails.amount}</p>
                <p><span className="font-medium">Payment Status:</span> {orderDetails.status || 'Successful'}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/orders" className="block">
              <Button className="w-full bg-black text-white">
                View Order Details
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
