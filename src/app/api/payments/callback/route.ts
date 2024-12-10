import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    // Get the payment reference from URL
    const url = new URL(request.url);
    const ref = url.searchParams.get('ref');

    if (!ref) {
      console.error('Payment callback received without reference');
      return NextResponse.redirect(`http://localhost:3002/checkout/error?message=Invalid payment reference`);
    }

    console.log('Processing payment callback for ref:', ref);

    // Call backend API to handle payment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // First, update the payment status in our backend
    const updateResponse = await fetch(`${apiUrl}/api/payments/callback?ref=${ref}`, {
      method: 'GET'
    });

    if (!updateResponse.ok) {
      console.error('Error updating payment status:', await updateResponse.text());
      return NextResponse.redirect(`http://localhost:3002/checkout/error?ref=${ref}&message=Failed to update payment status`);
    }

    // Then get the payment details
    const response = await fetch(`${apiUrl}/api/payments/status/${ref}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Error getting payment status:', await response.text());
      return NextResponse.redirect(`http://localhost:3002/checkout/error?ref=${ref}&message=Failed to verify payment status`);
    }

    const data = await response.json();
    console.log('Payment status:', data);

    // Redirect based on payment status
    if (data.status === 'CAPTURED' || data.status === 'AUTHORIZED') {
      // Redirect directly to success page with order details
      return NextResponse.redirect(`http://localhost:3002/checkout/success?orderId=${data.orderId}&ref=${ref}`);
    } else {
      return NextResponse.redirect(`http://localhost:3002/checkout/error?ref=${ref}&message=${data.errorMessage || 'Payment failed'}`);
    }
  } catch (error) {
    console.error('Error in payment callback:', error);
    return NextResponse.redirect(`http://localhost:3002/checkout/error?message=An unexpected error occurred`);
  }
}
