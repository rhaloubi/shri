"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Check } from "lucide-react"
import { cn } from "~/lib/utils"
import Image from "next/image"
import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {  colorPalettes, fontFamilies, storeTemplates } from "./data"

export function CreateStoreForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [selectedPalette, setSelectedPalette] = useState(0)
  const [selectedFont, setSelectedFont] = useState(0)
  const [showSearchBar, setShowSearchBar] = useState(true)
  const [showFooter, setShowFooter] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        toast.error("Authentication Error", {
          description: "You must be logged in to create a store.",
        })
        throw new Error("Authentication token not found")
      }

      const formData = {
        templateId: storeTemplates[selectedTemplate].name,
        primaryColor: colorPalettes[selectedPalette].primary,
        secondaryColor: colorPalettes[selectedPalette].secondary,
        fontFamily: fontFamilies[selectedFont].value,
        showSearchBar,
        showFooter,
        facebookUrl: (e.target as HTMLFormElement).facebook.value,
        instagramUrl: (e.target as HTMLFormElement).instagram.value,
        twitterUrl: (e.target as HTMLFormElement).twitter.value,
      }

      const response = await fetch("/api/store-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error("Failed to Create Store", {
          description: error.message || "An error occurred while creating your store.",
        })
        throw new Error(error.message || "Failed to create store")
      }

      toast.success("Store Created Successfully!", {
        description: "Your e-store template has been created and is ready to use.",
      })

      // router.refresh()
      router.push('/store-management/dashboard')
    } catch (error) {
      console.error("Error creating store:", error)
      if (error instanceof Error && !error.message.includes("Authentication")) {
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Store Template */}
      <Card>
        <CardHeader>
          <CardTitle>Store Template</CardTitle>
          <CardDescription>Choose a template to start with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {storeTemplates.map((template, index) => (
              <button
                key={template.name}
                type="button"
                onClick={() => setSelectedTemplate(index)}
                className={cn(
                  "relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                  selectedTemplate === index ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                {selectedTemplate === index && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <Image
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                  width={200}
                  height={100}
                  loading="lazy"
                />
                <div className="font-semibold">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Choose a curated color scheme for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colorPalettes.map((palette, index) => (
              <button
                key={palette.name}
                type="button"
                onClick={() => setSelectedPalette(index)}
                className={cn(
                  "relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                  selectedPalette === index ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                {selectedPalette === index && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className="flex gap-2 mb-3">
                  <div
                    className="h-12 w-12 rounded-md border border-border"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="h-12 w-12 rounded-md border border-border"
                    style={{ backgroundColor: palette.secondary }}
                  />
                </div>
                <div className="font-semibold">{palette.name}</div>
                <div className="text-xs text-muted-foreground">{palette.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Family */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Select a font family for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {fontFamilies.map((font, index) => (
              <button
                key={font.name}
                type="button"
                onClick={() => setSelectedFont(index)}
                className={cn(
                  "relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                  selectedFont === index ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                {selectedFont === index && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className="font-semibold mb-1">{font.name}</div>
                <div className="text-sm mb-2 font-medium" style={{ fontFamily: font.value }}>
                  {font.preview}
                </div>
                <div className="text-xs text-muted-foreground">{font.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input id="facebook" name="facebook" placeholder="https://facebook.com/yourstore" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input id="instagram" name="instagram" placeholder="https://instagram.com/yourstore" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input id="twitter" name="twitter" placeholder="https://twitter.com/yourstore" />
          </div>
        </CardContent>
      </Card>

      {/* UI Settings */}
      <Card>
        <CardHeader>
          <CardTitle>UI Settings</CardTitle>
          <CardDescription>{"Customize your store's interface elements"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="searchBar">Show Search Bar</Label>
              <div className="text-sm text-muted-foreground">Display a search bar in your store header</div>
            </div>
            <Switch id="searchBar" checked={showSearchBar} onCheckedChange={setShowSearchBar} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="footer">Show Footer</Label>
              <div className="text-sm text-muted-foreground">Display a footer section in your store</div>
            </div>
            <Switch id="footer" checked={showFooter} onCheckedChange={setShowFooter} />
          </div>
        </CardContent>
      </Card>

      {/* Submit button section */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⭮</span>
              Creating...
            </>
          ) : (
            "Create Store"
          )}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/store-management/dashboard")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
