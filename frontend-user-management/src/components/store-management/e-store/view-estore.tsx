"use client"

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Pencil, Store, Palette, Type, ImageIcon, Share2, Settings } from "lucide-react"
import { storeTemplates, colorPalettes, fontFamilies } from "~/components/store-management/e-store/data"
import Image from "next/image"
import { getCookie } from "cookies-next"
import { toast } from "sonner"
import { EditStoreDrawer } from "~/components/store-management/e-store/edit-store-drawer"

interface StoreSettings {
  templateId: string
  bannerImageUrl: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  showSearchBar: boolean
  showFooter: boolean
  createdAt: string
  hasEStore: boolean
}

type EditSection = "template" | "colors" | "font" | "social" | "ui" | null

export function StoreOverview() {
  const [storeData, setStoreData] = useState<StoreSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<EditSection>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const token = getCookie("better-auth.jwt")
        if (!token) {
          toast.error("Authentication Error", {
            description: "You must be logged in to view store settings.",
          })
          return
        }

        const response = await fetch("/api/store-settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch store data")
        }

        const data = await response.json()
        setStoreData(data)
      } catch (error) {
        console.error("Error fetching store data:", error)
        toast.error("Error", {
          description: "Failed to load store settings. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoreData()
  }, [])

  const handleUpdate = async (updates: Partial<StoreSettings>) => {
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) {
        toast.error("Authentication Error", {
          description: "You must be logged in to update store settings.",
        })
        return
      }

      const response = await fetch("/api/store-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update store settings")
      }

      const updatedData = await response.json()
      setStoreData((prev) => (prev ? { ...prev, ...updatedData } : null))

      toast.success("Success", {
        description: "Store settings updated successfully.",
      })
      setEditingSection(null)
    } catch (error) {
      console.error("Error updating store settings:", error)
      toast.error("Error", {
        description: "Failed to update store settings. Please try again.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!storeData) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Failed to load store data</p>
      </div>
    )
  }

  const selectedTemplate = storeTemplates.find((t) => t.name === storeData.templateId) || storeTemplates[0]
  const selectedPalette =
    colorPalettes.find((p) => p.primary === storeData.primaryColor && p.secondary === storeData.secondaryColor) ||
    colorPalettes[0]
  const selectedFont = fontFamilies.find((f) => f.value === storeData.fontFamily) || fontFamilies[0]

  return (
    <>

      {/* Store Status */}
      <Card className="p-6 mb-6 border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <div>
              <p className="font-semibold">Store is Live</p>
              <p className="text-sm text-muted-foreground">
                Created {new Date(storeData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Active
          </Badge>
        </div>
      </Card>

      <div className="grid gap-6">
        {/* Template Section */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Store className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Store Template</h2>
                <p className="text-sm text-muted-foreground">Your store's layout and structure</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setEditingSection("template")}
            >
              <Pencil className="w-4 h-4" />
              Edit Template
            </Button>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border-2 border-primary">
                <Image
                  src={selectedTemplate.preview || "/placeholder.svg"}
                  alt={selectedTemplate.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold">{selectedTemplate.name}</p>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>
            </div>
          </div>
        </Card>


        {/* Design System Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Color Palette */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 rounded-lg">
                  <Palette className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Color Palette</h2>
                  <p className="text-sm text-muted-foreground">Brand colors</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => setEditingSection("colors")}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-xs font-medium text-muted-foreground mb-2">{selectedPalette.name}</p>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="h-12 rounded border" style={{ backgroundColor: selectedPalette.primary }} />
                    <p className="text-xs text-center font-mono">Primary</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="h-12 rounded border" style={{ backgroundColor: selectedPalette.secondary }} />
                    <p className="text-xs text-center font-mono">Secondary</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Type className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Typography</h2>
                  <p className="text-sm text-muted-foreground">Font family</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
                onClick={() => setEditingSection("font")}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <p className="text-xs font-medium text-muted-foreground mb-3">{selectedFont.name}</p>
              <div className="space-y-2" style={{ fontFamily: selectedFont.value }}>
                <p className="text-2xl font-bold">The quick brown fox</p>
                <p className="text-sm text-muted-foreground">jumps over the lazy dog</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Social Media Section */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Share2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Social Media</h2>
                <p className="text-sm text-muted-foreground">Connected social accounts</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setEditingSection("social")}
            >
              <Pencil className="w-4 h-4" />
              Edit Links
            </Button>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {storeData.facebookUrl && (
              <div className="p-3 bg-muted/50 rounded-lg border flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Facebook</p>
                  <p className="text-sm truncate">{storeData.facebookUrl || "Not connected"}</p>
                </div>
              </div>
            )}
            {storeData.instagramUrl && (
              <div className="p-3 bg-muted/50 rounded-lg border flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Instagram</p>
                  <p className="text-sm truncate">{storeData.instagramUrl || "Not connected"}</p>
                </div>
              </div>
            )}
            {storeData.twitterUrl && (
              <div className="p-3 bg-muted/50 rounded-lg border flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Twitter</p>
                  <p className="text-sm truncate">{storeData.twitterUrl || "Not connected"}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* UI Settings Section */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Settings className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">UI Settings</h2>
                <p className="text-sm text-muted-foreground">Store interface preferences</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setEditingSection("ui")}
            >
              <Pencil className="w-4 h-4" />
              Configure
            </Button>
          </div>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Search Bar</p>
                  <p className="text-xs text-muted-foreground">Product search functionality</p>
                </div>
                <Badge variant={storeData.showSearchBar ? "default" : "secondary"}>
                  {storeData.showSearchBar ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Footer</p>
                  <p className="text-xs text-muted-foreground">Store footer section</p>
                </div>
                <Badge variant={storeData.showFooter ? "default" : "secondary"}>
                  {storeData.showFooter ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* EditStoreDrawer component */}
      <EditStoreDrawer
        isOpen={editingSection !== null}
        section={editingSection}
        storeData={storeData}
        onClose={() => setEditingSection(null)}
        onUpdate={handleUpdate}
      />
    </>
  )
}
