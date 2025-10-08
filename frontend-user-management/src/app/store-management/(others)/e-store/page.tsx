"use client"

import { useEffect, useState } from "react"
import { EmptyStoreState } from "~/components/store-management/e-store/empty-estore"
import { CreateStoreForm } from "~/components/store-management/e-store/create-estore"
import { getCookie } from "cookies-next"
import { StoreOverview } from "~/components/store-management/e-store/view-estore"
import { toast } from "sonner"
import { ExternalLink , Store } from "lucide-react"
import { Button } from "~/components/ui/button"



export default function CreateStorePage() {
  const [hasStore, setHasStore] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    const checkStore = async () => {
      try {
        const token = getCookie("better-auth.jwt")
        if (!token) {
          toast.error("Authentication Error", {
            description: "You must be logged in to view store settings.",
          })
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/store-settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error("Failed to check store status")
        }
        
        const data = await response.json()
        setHasStore(data.hasEStore ?? false)
      } catch (error) {
        console.error('Error checking store status:', error)
        toast.error("Error", {
          description: "Failed to check store status. Please try again.",
        })
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

  if (showCreateForm) {
    return (
      <main className="p-6">
        <CreateStoreForm />
      </main>
    )
  }

  return (
    <main className="p-6">
      {hasStore ? (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-balance">Your E-Store</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage your store configuration and settings</p>
                      </div>
                    </div>
                    <Button size="lg" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Visit Store
                    </Button>
                  </div>
                </div>
              <StoreOverview />
            </div>
      ) : (
        <EmptyStoreState onCreateStore={() => setShowCreateForm(true)} />
      )}
    </main>
  )
}
