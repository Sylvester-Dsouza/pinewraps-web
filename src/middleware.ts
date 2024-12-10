import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get Firebase session cookie and auth token
  const firebaseSession = request.cookies.get('__session')
  const authToken = request.cookies.get('authToken')?.value || request.headers.get('authorization')?.split('Bearer ')[1]
  
  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith('/account')) {
    // If neither session cookie nor auth token exists, redirect to login
    if (!firebaseSession && !authToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
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
    '/wishlist/:path*',
  ]
}
