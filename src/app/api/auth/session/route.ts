import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    // Set the cookie
    const cookiesStore = await cookies()
    cookiesStore.set('__session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 5, // 5 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting session cookie:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Remove the cookie
    const cookiesStore = await cookies()
    cookiesStore.delete('__session')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing session cookie:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
