import type React from "react"
import { AuthProvider } from "~/components/auth/auth-provider"
import { Suspense } from "react"
import { ThemeProvider } from "~/components/theme-provider"


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        <Suspense fallback={<div>Loading...</div>}>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        </Suspense>
    </>
  )
}
