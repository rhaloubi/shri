import { createAuthClient } from "better-auth/react"

// Use empty string to make all requests relative to current origin
// This is the simplest and most portable solution
export const authClient = createAuthClient({
  baseURL: "", // Empty string = relative URLs
  // Or use: baseURL: typeof window !== "undefined" ? "" : (process.env.BETTER_AUTH_URL ?? "http://localhost:3000")
})

export const { signIn, signUp, signOut, useSession, getSession } = authClient

export const getJWTToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/token", {
      method: "GET",
      credentials: "include",
    })

    if (response.ok) {
      const data = await response.json() as { token: string }
      return data?.token || null
    }
    return null
  } catch (error) {
    console.error("Failed to get JWT token:", error)
    return null
  }
}

export const setJWTToken = async (token: string): Promise<void> => {
  try {
    await fetch("/api/auth/set-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })
  } catch (error) {
    console.error("Failed to store JWT token:", error)
  }
}

export const removeJWTToken = async (): Promise<void> => {
  try {
    await fetch("/api/auth/set-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token: null }),
    })
  } catch (error) {
    console.error("Failed to remove JWT token:", error)
  }
}