import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json() as { token: string }
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Valid token is required' }, { status: 400 })
    }

    // Create response and set cookie
    const response = NextResponse.json({ success: true })
    
    response.cookies.set('better-auth.jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error setting token cookie:', error)
    return NextResponse.json({ error: 'Failed to set token' }, { status: 500 })
  }
}