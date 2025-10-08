"use client"

import { useEffect, useState } from "react"
import { EmptyStoreState } from "~/components/store-management/e-store/empty-estore"
import { CreateStoreForm } from "~/components/store-management/e-store/create-estore"
import { getCookie } from "cookies-next"

export default function CreateStorePage() {
  const [hasStore, setHasStore] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasEStore, setHasEStore] = useState<boolean>(false)
  useEffect(() => {
    const checkStore = async () => {
      try {
        const token = getCookie("better-auth.jwt")
        if (!token) throw new Error("Authentication token not found")

        const response = await fetch('/api/store-settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await response.json()
        setHasStore(data.hasEStore ?? false)
      } catch (error) {
        console.error('Error checking store status:', error)
        setHasStore(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkStore()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="p-6">
      { hasStore ? (
        <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">You have an e-store!</h1>
      </div>
    ):(
        <div>
            {hasEStore ? (
                <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">You already have an e-store!</h1>
                <CreateStoreForm isEditing={true} />
                </div>
            ) : (
                <EmptyStoreState onCreateStore={() => setHasEStore(true)} />
            )}
        </div>
      
    )
    }
    </main>
  )
}
