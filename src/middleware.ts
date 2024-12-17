import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check for x-redirect-location header
  const redirectUrl = request.headers.get('x-redirect-location');
  if (redirectUrl) {
    return NextResponse.redirect(redirectUrl);
  }

  // Get Firebase session cookie and auth token
  const firebaseSession = request.cookies.get('__session')
  const authToken = request.cookies.get('authToken')?.value || request.headers.get('authorization')?.split('Bearer ')[1]
  
  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith('/account')) {
    // If neither session cookie nor auth token exists, redirect to login
    if (!firebaseSession && !authToken) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    
    // Clone the headers to modify them
    const requestHeaders = new Headers(request.headers)
    
    // If we have an auth token, add it to the headers
    if (authToken) {
      requestHeaders.set('Authorization', `Bearer ${authToken}`)
    }
    
    // Return the response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/account/:path*',
    '/checkout/:path*',
    '/shop/:path*'
  ]
}
