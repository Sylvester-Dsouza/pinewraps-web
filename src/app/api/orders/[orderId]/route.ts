import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

type ParamCheck<T> = T extends Promise<infer U> ? U : T;

export async function GET(
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

    // Forward the request to the API server
    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
