import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const token = (await request.json()) as string

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Set JWT in httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set("better-auth.jwt", token , {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 1, // 1 day
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting JWT cookie:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
