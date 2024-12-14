'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="container max-w-lg mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold">Payment Successful!</h1>

        <p className="text-muted-foreground">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        <div className="mt-4">
          <p className="text-lg">
            Order Number: <span className="font-semibold">{orderNumber}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Reference: {ref}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href={`/orders/${orderId}`}
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-md text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
              "h-10 px-4 py-2"
            )}
          >
            View Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
          <Link 
            href="/"
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-md text-sm font-medium",
              "border border-input bg-background",
              "hover:bg-accent hover:text-accent-foreground",
              "h-10 px-4 py-2"
            )}
          >
            Continue Shopping
            <Home className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
