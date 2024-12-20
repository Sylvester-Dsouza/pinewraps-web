'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const ref = searchParams.get('ref');
  const status = searchParams.get('status');

  const getErrorMessage = () => {
    if (status === 'CANCELLED') {
      return 'Your payment was cancelled.';
    }
    return message || 'An error occurred while processing your payment.';
  };

  return (
    <div className="container max-w-lg mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6">
        <div className="rounded-full bg-red-100 p-3">
          <AlertCircle className="w-16 h-16 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold">Payment Failed</h1>

        <p className="text-muted-foreground">
          {getErrorMessage()}
        </p>

        {ref && (
          <p className="text-sm text-muted-foreground">
            Reference: {ref}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link 
            href="/checkout"
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-md text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90",
              "h-10 px-4 py-2"
            )}
          >
            Try Again
            <RefreshCcw className="ml-2 h-4 w-4" />
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
            Return to Home
            <Home className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          If you continue to experience issues, please contact our support team.
        </p>
      </div>
    </div>
  );
}
