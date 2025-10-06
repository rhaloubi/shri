"use client"

import { useSession } from "~/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Toaster } from "sonner"
import { AccountForm } from "~/components/create-store/account-form"
import { StoreForm } from "~/components/create-store/store-form"

export default function CreateStorePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [accountData, setAccountData] = useState<{
    userID: string
    businessName: string
    phone: string
  } | null>(null)

  const handleAccountSuccess = (data: { userID: string; businessName: string; phone: string }) => {
    setAccountData(data)
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Please sign in to create a store</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            {accountData ? "Create Store" : "Create Business Account"}
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mt-2">
            {accountData
              ? "Complete the store setup for your business"
              : "Start by creating a business account, then add your store details"}
          </p>
        </div>

        <div className="max-w-2xl">
          {!accountData ? (
            <AccountForm onSuccess={handleAccountSuccess} />
          ) : (
            <StoreForm accountData={accountData} />
          )}
        </div>
      </div>
    </div>
  )
}
