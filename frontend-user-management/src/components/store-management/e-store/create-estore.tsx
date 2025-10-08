"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { Check } from "lucide-react"
import { cn } from "~/lib/utils"
import Image from "next/image"

const storeTemplates = [
  {
    name: "Modern Minimal",
    description: "Clean and contemporary design with focus on products",
    preview: "/modern-minimal-store-template.jpg",
  },
  {
    name: "Classic Elegant",
    description: "Timeless design with sophisticated typography",
    preview: "/classic-elegant-store-template.jpg",
  },
]

const bannerOptions = [
  {
    name: "Fashion",
    url: "/fashion-store-banner.png",
    description: "Stylish fashion banner",
  },
  {
    name: "Tech",
    url: "/technology-store-banner.jpg",
    description: "Modern tech banner",
  },
  {
    name: "Food",
    url: "/food-store-banner.jpg",
    description: "Appetizing food banner",
  },
  {
    name: "Lifestyle",
    url: "/lifestyle-store-banner.jpg",
    description: "Vibrant lifestyle banner",
  },
]

const colorPalettes = [
  {
    name: "Midnight",
    primary: "#000000",
    secondary: "#ffffff",
    description: "Classic black and white",
  },
  {
    name: "Ocean",
    primary: "#0070f3",
    secondary: "#00d4ff",
    description: "Deep blue with cyan accent",
  },
  {
    name: "Forest",
    primary: "#16a34a",
    secondary: "#dcfce7",
    description: "Natural green tones",
  },
  {
    name: "Sunset",
    primary: "#f97316",
    secondary: "#fef3c7",
    description: "Warm orange and cream",
  },
  {
    name: "Royal",
    primary: "#7c3aed",
    secondary: "#e9d5ff",
    description: "Rich purple palette",
  },
  {
    name: "Rose",
    primary: "#e11d48",
    secondary: "#ffe4e6",
    description: "Elegant rose and pink",
  },
]

const fontFamilies = [
  {
    name: "Inter",
    value: "Inter",
    preview: "The quick brown fox jumps",
    description: "Modern and versatile",
  },
  {
    name: "Playfair Display",
    value: "Playfair Display",
    preview: "The quick brown fox jumps",
    description: "Elegant serif",
  },
  {
    name: "Space Grotesk",
    value: "Space Grotesk",
    preview: "The quick brown fox jumps",
    description: "Geometric sans-serif",
  },
  {
    name: "Merriweather",
    value: "Merriweather",
    preview: "The quick brown fox jumps",
    description: "Classic serif",
  },
  {
    name: "Poppins",
    value: "Poppins",
    preview: "The quick brown fox jumps",
    description: "Friendly and rounded",
  },
  {
    name: "Roboto Mono",
    value: "Roboto Mono",
    preview: "The quick brown fox jumps",
    description: "Technical monospace",
  },
]

interface CreateStoreFormProps {
  initialData?: {
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    bannerImageUrl?: string
    facebookUrl?: string
    instagramUrl?: string
    twitterUrl?: string
    showSearchBar?: boolean
    showFooter?: boolean
  }
  isEditing?: boolean
}

export function CreateStoreForm({ initialData, isEditing = false }: CreateStoreFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0)

  const [selectedBanner, setSelectedBanner] = useState(() => {
    if (initialData?.bannerImageUrl) {
      const index = bannerOptions.findIndex((b) => b.url === initialData.bannerImageUrl)
      return index >= 0 ? index : 0
    }
    return 0
  })

  const [selectedPalette, setSelectedPalette] = useState(() => {
    if (initialData?.primaryColor) {
      const index = colorPalettes.findIndex((p) => p.primary === initialData.primaryColor)
      return index >= 0 ? index : 0
    }
    return 0
  })

  const [selectedFont, setSelectedFont] = useState(() => {
    if (initialData?.fontFamily) {
      const index = fontFamilies.findIndex((f) => f.value === initialData.fontFamily)
      return index >= 0 ? index : 0
    }
    return 0
  })

  const [showSearchBar, setShowSearchBar] = useState(initialData?.showSearchBar ?? true)
  const [showFooter, setShowFooter] = useState(initialData?.showFooter ?? true)

  return (
    <form className="space-y-6 max-w-5xl">
      <Card>
        <CardHeader>
          <CardTitle>Store Template</CardTitle>
          <CardDescription>Choose a template to start with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {storeTemplates.map((template, index) => (
              <Button
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
                  width={400}
                  height={128}
                />
                <div className="font-semibold">{template.name}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </Button>
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
              <Button
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
              </Button>
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
              <Button
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
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Banner Image</CardTitle>
          <CardDescription>Choose a banner for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {bannerOptions.map((banner, index) => (
              <Button
                key={banner.name}
                type="button"
                onClick={() => setSelectedBanner(index)}
                className={cn(
                  "relative rounded-lg border-2 p-2 text-left transition-all hover:border-primary/50",
                  selectedBanner === index ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                {selectedBanner === index && (
                  <div className="absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-primary z-10">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <Image
                  src={banner.url || "/placeholder.svg"}
                  alt={banner.name}
                  className="w-full h-24 object-cover rounded-md mb-2"
                  width={400}
                  height={96}
                />
                <div className="px-2 pb-2">
                  <div className="font-semibold text-sm">{banner.name}</div>
                  <div className="text-xs text-muted-foreground">{banner.description}</div>
                </div>
              </Button>
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
            <Input id="facebook" placeholder="https://facebook.com/yourstore" defaultValue={initialData?.facebookUrl} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/yourstore"
              defaultValue={initialData?.instagramUrl}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input id="twitter" placeholder="https://twitter.com/yourstore" defaultValue={initialData?.twitterUrl} />
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

      <div className="flex gap-4">
        <Button type="submit" size="lg">
          {isEditing ? "Save Changes" : "Create Store Template"}
        </Button>
        <Button type="button" variant="outline" size="lg">
          Cancel
        </Button>
      </div>
    </form>
  )
}
