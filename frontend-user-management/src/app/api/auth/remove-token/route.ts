import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('better-auth.jwt')?.value

    return NextResponse.json({ token: token ?? null })
  } catch (error) {
    console.error('Error getting token:', error)
    return NextResponse.json({ error: 'Failed to get token' }, { status: 500 })
  }
}