import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ref = url.searchParams.get('ref');
    const cancelled = url.searchParams.get('cancelled');

    if (!ref) {
      return NextResponse.redirect(new URL('/checkout/error?message=Payment reference missing', url.origin));
    }

    if (cancelled === 'true') {
      return NextResponse.redirect(new URL(`/checkout/error?message=Payment was cancelled&ref=${ref}&status=CANCELLED`, url.origin));
    }

    // Forward the callback to the API server
    const response = await fetch(`${API_URL}/api/payments/callback?ref=${ref}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.redirect(new URL(`/checkout/error?message=${error.message || 'Payment processing failed'}&ref=${ref}`, url.origin));
    }

    // Get payment status from backend
    const statusResponse = await fetch(`${API_URL}/api/payments/status/${ref}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const paymentStatus = await statusResponse.json();
    console.log('Payment status:', paymentStatus);

    if (paymentStatus.status === 'CAPTURED') {
      return NextResponse.redirect(new URL(`/checkout/success?orderId=${paymentStatus.orderId}&ref=${ref}`, url.origin));
    } else {
      return NextResponse.redirect(new URL(`/checkout/error?message=${paymentStatus.errorMessage || 'Payment was not successful'}&ref=${ref}&status=${paymentStatus.status || 'FAILED'}`, url.origin));
    }

  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.redirect(new URL('/checkout/error?message=Payment processing failed', url.origin));
  }
}

export async function POST(request: Request) {
  try {
    const paymentData = await request.json();

    // Forward the callback to the API server
    const response = await fetch(`${API_URL}/api/payments/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error processing payment callback:', error);
    return NextResponse.json(
      { error: 'Failed to process payment callback' },
      { status: 500 }
    );
  }
}

// Define allowed HTTP methods
export const dynamic = 'force-dynamic';
export const runtime = 'edge';
export const revalidate = 0;

// This is important - it tells Next.js which HTTP methods are allowed
export const allowedMethods = ['GET', 'POST'];
