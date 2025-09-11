import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "~/components/auth/auth-provider"
import { Suspense } from "react"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <Analytics />
    </>
  )
}
