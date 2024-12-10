import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Forward the authorization header from the client
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to the API server
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/rewards`;  
    console.log('Fetching rewards from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.success || !data.data) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid response format from API');
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in rewards API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards', details: error.message },
      { status: 500 }
    );
  }
}
