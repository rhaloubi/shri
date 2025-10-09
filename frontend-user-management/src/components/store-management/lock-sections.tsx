"use client"

import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"
import { Store, Lock, ArrowRight } from "lucide-react"

export function LockSections() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Store className="h-12 w-12 text-muted-foreground" />
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1">
                <Lock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight">
            Create Your Store
          </h2>
          
          <p className="text-muted-foreground">
            You currently don't have a store. Create one to access the dashboard and start managing your products and orders.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-medium">What you'll get:</h3>
            <ul className="text-sm text-left space-y-2">
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                Complete store management dashboard
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                Product catalog management
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                Order tracking and management
              </li>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-primary" />
                Store analytics and insights
              </li>
            </ul>
          </div>

          <Button 
            onClick={() => router.push('/store-management/create-store')}
            className="w-full"
          >
            Create Your Store
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Need help? Contact our support team for assistance.
        </p>
      </div>
    </div>
  )
}