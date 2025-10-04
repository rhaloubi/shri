"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

interface AccountFormProps {
  onSuccess: (accountData: { userID: string; businessName: string; phone: string }) => void
}

export function AccountForm({ onSuccess }: AccountFormProps) {
  const [businessName, setBusinessName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("better-auth.jwt="))
        ?.split("=")[1]

      if (!token) {
        throw new Error("Authentication token not found")
      }

      const response = await fetch("http://localhost:8000/api/store-owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          businessName,
          phone
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create business account: ${response.statusText}`)
      }

      const data = await response.json()
      onSuccess({ 
        userID: data.ID, // Using the ID from the response
        businessName, 
        phone 
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create business account")
      console.error("Error creating business account:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Create Business Account</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter business details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-foreground">
              Business Name
            </Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter business name"
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 XX XXX XXX"
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
