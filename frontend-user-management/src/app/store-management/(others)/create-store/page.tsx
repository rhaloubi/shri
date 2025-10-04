"use client"

import { useState } from "react"
import { AccountForm } from "~/components/create-store/account-form"
import { StoreForm } from "~/components/create-store/store-form"

export default function CreateStorePage() {
  const [accountData, setAccountData] = useState<{
    userID: string
    businessName: string
    phone: string
  } | null>(null)

  const handleAccountSuccess = (data: { userID: string; businessName: string; phone: string }) => {
    setAccountData(data)
  }

  return (
    <main className="ml-64 mt-16 min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="font-sans text-3xl font-bold text-foreground text-balance">
            {accountData ? "Create Store" : "Create Business Account"}
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            {accountData
              ? "Complete the store setup for your business"
              : "Start by creating a business account, then add your store details"}
          </p>
        </div>
        {!accountData ? (
          <AccountForm onSuccess={handleAccountSuccess} />
        ) : (
          <StoreForm accountData={accountData} />
        )}
      </div>
    </main>
  )
}
