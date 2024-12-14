import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ref = url.searchParams.get('ref');
    const cancelled = url.searchParams.get('cancelled');

    if (!ref) {
      return Response.redirect(new URL('/checkout/error?message=Payment reference missing', url.origin), 303);
    }

    if (cancelled === 'true') {
      return Response.redirect(new URL(`/checkout/error?message=Payment was cancelled&ref=${ref}&status=CANCELLED`, url.origin), 303);
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
      return Response.redirect(new URL(`/checkout/error?message=${error.message || 'Payment processing failed'}&ref=${ref}`, url.origin), 303);
    }

    const data = await response.json();
    console.log('Payment callback response:', data);

    // Check if payment is successful - CAPTURED, PURCHASED, AUTHORISED are all success states
    if (data.status === 'CAPTURED' || data.status === 'PURCHASED' || data.status === 'AUTHORISED' || data.status === 'AUTHORIZED') {
      const successUrl = new URL('/checkout/success', url.origin);
      successUrl.searchParams.set('orderId', data.order.id);
      successUrl.searchParams.set('orderNumber', data.order.orderNumber);
      successUrl.searchParams.set('ref', ref);
      return Response.redirect(successUrl.toString(), 303);
    }

    // If payment is not successful, redirect to error page
    return Response.redirect(new URL(`/checkout/error?message=${data.errorMessage || 'Payment verification failed'}&ref=${ref}&status=${data.status || 'FAILED'}`, url.origin), 303);

  } catch (error) {
    console.error('Error processing payment callback:', error);
    return Response.redirect(new URL('/checkout/error?message=Payment processing failed', url.origin), 303);
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
