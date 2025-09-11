"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "~/lib/auth-client"

interface AuthContextType {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(isPending)
  }, [isPending])

  const value = {
    user: session?.user ?? null,
    isLoading,
    isAuthenticated: !!session?.user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
