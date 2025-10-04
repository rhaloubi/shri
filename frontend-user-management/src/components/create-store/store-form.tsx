"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Upload } from "lucide-react"

const moroccoRegions = [
  "Tanger-Tétouan-Al Hoceïma",
  "Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
]

interface StoreFormProps {
  accountData: { userID: string; businessName: string; phone: string }
}

export function StoreForm({ accountData }: StoreFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

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

      // First, upload the logo if present
      let logoURL = ""
      if (logo) {
        const formData = new FormData()
        formData.append("logo", logo)
        // Implement logo upload endpoint and get the URL
        // This is a placeholder - you'll need to implement the actual image upload
        // logoURL = await uploadLogo(formData, token)
      }

      // Create the store
      const response = await fetch("http://localhost:8000/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          storeOwnerID: accountData.userID,
          name,
          description,
          street,
          city,
          state,
          logoURL,
          isActive: true
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create store: ${response.statusText}`)
      }

      const data = await response.json()
      // Redirect to dashboard or show success message
      window.location.href = "/store-management/dashboard"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create store")
      console.error("Error creating store:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Create Store</CardTitle>
        <CardDescription className="text-muted-foreground">
          Add a new store for {accountData.businessName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Store Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter store name"
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter store description (optional)"
              rows={3}
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="street" className="text-foreground">
              Street Address *
            </Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Enter street address"
              required
              className="bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-foreground">
                City *
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-foreground">
                Region *
              </Label>
              <Select value={state} onValueChange={setState} required>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {moroccoRegions.map((region) => (
                    <SelectItem key={region} value={region} className="text-popover-foreground">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo" className="text-foreground">
              Store Logo
            </Label>
            <div className="flex items-center gap-4">
              <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("logo")?.click()}
                className="bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Upload className="mr-2 h-4 w-4" />
                {logo ? logo.name : "Upload Logo"}
              </Button>
              {logo && <span className="text-sm text-muted-foreground">{(logo.size / 1024).toFixed(2)} KB</span>}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Creating Store..." : "Create Store"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
