"use client"

import { Store } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"
import { useHasStore } from "~/hooks/useHasStore"
import { SidebarMenu ,  SidebarMenuItem, } from "~/components/ui/sidebar"

interface StoreDetails {
  ID: string
  Name: string
  Description: string
  LogoURL: string
  Street: string
  City: string
  State: string
  IsActive: boolean
}

export function StoreDisplay() {
  const [store, setStore] = useState<StoreDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { hasStore } = useHasStore()

  const fetchStoreDetails = async () => {
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/stores`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: 'include',
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error("Failed to fetch store details")
      }

      const data = await response.json()
      setStore(Array.isArray(data) ? data[0] : data)
    } catch (error) {
      console.error("Error fetching store details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (hasStore) {
      void fetchStoreDetails()
    } else {
      setIsLoading(false)
    }
  }, [hasStore])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-3">
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
          <div className="h-3 w-16 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  if (!hasStore || !store) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        
         <div className="flex items-center gap-4">
            {store.LogoURL ? (
              <Image
                src={store.LogoURL}
                alt={store.Name}
                width={32}
                height={32}
                className="rounded-md"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-4 w-4 text-primary" />
              </div>
            )}

            <div className="flex-1 text-left text-lg leading-tight">
              <span className="truncate ">{store.Name}</span>
            </div>
          </div>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}