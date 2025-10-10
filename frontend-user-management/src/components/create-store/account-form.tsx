"use client"

import type React from "react"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { getCookie } from "cookies-next"

interface AccountFormProps {
  onSuccess: (accountData: { userID: string; businessName: string; phone: string }) => void
}

export function AccountForm({ onSuccess }: AccountFormProps) {
  const [businessName, setBusinessName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch(`/api/store-owners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          businessName,
          phone
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("You already have a business account")
        }
        throw new Error("Failed to create business account")
      }

      const data = await response.json()
      toast.success("Business account created successfully")
      onSuccess({ 
        userID: data.ID,
        businessName, 
        phone 
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create business account")
      console.error("Error creating business account:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Account</CardTitle>
        <CardDescription>
          Create your business account to start selling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212600000000"
              required
              pattern="^\+[0-9]{12}$"
            />
            <p className="text-xs text-muted-foreground">
              Format: +212XXXXXXXXX (Morocco)
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Business Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
