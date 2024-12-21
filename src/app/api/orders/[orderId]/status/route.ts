import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

type ParamCheck<T> = T extends Promise<infer U> ? U : T;

export async function PUT(
  request: NextRequest,
  context: ParamCheck<RouteContext>
): Promise<NextResponse> {
  try {
    const { orderId } = await context.params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and forward to API
    const token = authHeader.split('Bearer ')[1];
    await auth.verifyIdToken(token);

    // Get the status from request body
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Forward the request to the API server
    const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
