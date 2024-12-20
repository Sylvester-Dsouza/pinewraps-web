import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token and forward to API
    const token = authHeader.split('Bearer ')[1];
    try {
      await auth.verifyIdToken(token);
    } catch (verifyError) {
      console.error('Token verification error:', verifyError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Forward the request to the API server
    const response = await fetch(`${API_URL}/api/rewards`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch rewards from API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch rewards',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
