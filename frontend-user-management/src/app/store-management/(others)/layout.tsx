"use client"

import type React from "react"

import { AppSidebar } from "~/layout/store-management/sidebar/app-sidebar"
import Header from "~/layout/store-management/header"
import HasStore from "~/components/store-management/hasStore"
import { SidebarProvider } from "~/components/ui/sidebar"
import { HasStoreProvider } from "~/hooks/useHasStore"
import { useEffect, useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Prevent hydration mismatch by not rendering until client-side
  }

  return (
    <HasStoreProvider>
      <SidebarProvider>
        <HasStore />
        <div className="flex max-w-none sm:max-w-screen min-w-none sm:min-w-screen min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex w-full sm:w-[70%] flex-col ">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 w-full max-w-[100vw] sm:max-w-none">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </HasStoreProvider>
  )
}
