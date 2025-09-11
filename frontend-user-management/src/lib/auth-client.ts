import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
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
      return data.token || null
    }
    return null
  } catch (error) {
    console.error("Failed to get JWT token:", error)
    return null
  }
}

export const setJWTToken = async (): Promise<void> => {
  try {

    const token = await getJWTToken()
    
    if (!token) {
      console.error("No token received from /api/auth/token")
      return
    }

    const response = await fetch("/api/auth/set-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      throw new Error(`Failed to set JWT cookie: ${response.statusText}`)
    }

    console.log("JWT token stored in cookies successfully")
  } catch (error) {
    console.error("Failed to store JWT token:", error)
  }
}

export const removeJWTToken = async (): Promise<void> => {
  try {
    const response = await fetch("/api/auth/set-jwt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token: null }),
    })

    if (!response.ok) {
      throw new Error(`Failed to remove JWT cookie: ${response.statusText}`)
    }

    console.log("JWT token removed from cookies successfully")
  } catch (error) {
    console.error("Failed to remove JWT token:", error)
  }
}

