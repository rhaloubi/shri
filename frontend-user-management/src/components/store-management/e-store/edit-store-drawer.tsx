"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Switch } from "~/components/ui/switch"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer"
import { storeTemplates, colorPalettes, fontFamilies } from "~/components/store-management/e-store/data"
import Image from "next/image"

type EditSection = "template" | "colors" | "font" | "social" | "ui" | null

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
}

interface EditStoreDrawerProps {
  isOpen: boolean
  section: EditSection
  storeData: StoreSettings
  onClose: () => void
  onUpdate: (updates: Partial<StoreSettings>) => Promise<void>
}

export function EditStoreDrawer({ isOpen, section, storeData, onClose, onUpdate }: EditStoreDrawerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(storeData.templateId)
  const [selectedBanner, setSelectedBanner] = useState(storeData.bannerImageUrl)
  const [selectedPalette, setSelectedPalette] = useState(
    colorPalettes.findIndex((p) => p.primary === storeData.primaryColor && p.secondary === storeData.secondaryColor),
  )
  const [selectedFont, setSelectedFont] = useState(storeData.fontFamily)
  const [socialUrls, setSocialUrls] = useState({
    facebook: storeData.facebookUrl || "",
    instagram: storeData.instagramUrl || "",
    twitter: storeData.twitterUrl || "",
  })
  const [uiSettings, setUiSettings] = useState({
    showSearchBar: storeData.showSearchBar,
    showFooter: storeData.showFooter,
  })

  const handleSave = async () => {
    let updates: Partial<StoreSettings> = {}

    switch (section) {
      case "template":
        updates = { templateId: selectedTemplate }
        break
      case "colors":
        const palette = colorPalettes[selectedPalette]
        updates = { primaryColor: palette.primary, secondaryColor: palette.secondary }
        break
      case "font":
        updates = { fontFamily: selectedFont }
        break
      case "social":
        updates = {
          facebookUrl: socialUrls.facebook,
          instagramUrl: socialUrls.instagram,
          twitterUrl: socialUrls.twitter,
        }
        break
      case "ui":
        updates = {
          showSearchBar: uiSettings.showSearchBar,
          showFooter: uiSettings.showFooter,
        }
        break
    }

    await onUpdate(updates)
  }

  const renderContent = () => {
    switch (section) {
      case "template":
        return (
          <>
            <DrawerHeader>
              <DrawerTitle>Select Template</DrawerTitle>
              <DrawerDescription>Choose a layout for your store</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
                {storeTemplates.map((template) => (
                  <div key={template.name} className="flex items-center space-x-4">
                    <RadioGroupItem value={template.name} id={template.name} />
                    <Label htmlFor={template.name} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded overflow-hidden border">
                          <Image
                            src={template.preview || "/placeholder.svg"}
                            alt={template.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        )


      case "colors":
        return (
          <>
            <DrawerHeader>
              <DrawerTitle>Select Color Palette</DrawerTitle>
              <DrawerDescription>Choose your brand colors</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <RadioGroup
                value={selectedPalette.toString()}
                onValueChange={(v) => setSelectedPalette(Number.parseInt(v))}
              >
                {colorPalettes.map((palette, index) => (
                  <div key={palette.name} className="flex items-center space-x-4">
                    <RadioGroupItem value={index.toString()} id={palette.name} />
                    <Label htmlFor={palette.name} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <div className="w-12 h-12 rounded border" style={{ backgroundColor: palette.primary }} />
                          <div className="w-12 h-12 rounded border" style={{ backgroundColor: palette.secondary }} />
                        </div>
                        <div>
                          <p className="font-medium">{palette.name}</p>
                          <p className="text-sm text-muted-foreground">{palette.description}</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        )

      case "font":
        return (
          <>
            <DrawerHeader>
              <DrawerTitle>Select Typography</DrawerTitle>
              <DrawerDescription>Choose your font family</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <RadioGroup value={selectedFont} onValueChange={setSelectedFont}>
                {fontFamilies.map((font) => (
                  <div key={font.name} className="flex items-center space-x-4">
                    <RadioGroupItem value={font.value} id={font.name} />
                    <Label htmlFor={font.name} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{font.name}</p>
                        <p className="text-sm text-muted-foreground mb-2">{font.description}</p>
                        <p className="text-lg" style={{ fontFamily: font.value }}>
                          {font.preview}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        )

      case "social":
        return (
          <>
            <DrawerHeader>
              <DrawerTitle>Social Media Links</DrawerTitle>
              <DrawerDescription>Update your social media URLs</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/yourstore"
                  value={socialUrls.facebook}
                  onChange={(e) => setSocialUrls({ ...socialUrls, facebook: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/yourstore"
                  value={socialUrls.instagram}
                  onChange={(e) => setSocialUrls({ ...socialUrls, instagram: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/yourstore"
                  value={socialUrls.twitter}
                  onChange={(e) => setSocialUrls({ ...socialUrls, twitter: e.target.value })}
                />
              </div>
            </div>
          </>
        )

      case "ui":
        return (
          <>
            <DrawerHeader>
              <DrawerTitle>UI Settings</DrawerTitle>
              <DrawerDescription>Configure your store interface</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="search-bar">Search Bar</Label>
                  <p className="text-sm text-muted-foreground">Enable product search functionality</p>
                </div>
                <Switch
                  id="search-bar"
                  checked={uiSettings.showSearchBar}
                  onCheckedChange={(checked) => setUiSettings({ ...uiSettings, showSearchBar: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="footer">Footer</Label>
                  <p className="text-sm text-muted-foreground">Show store footer section</p>
                </div>
                <Switch
                  id="footer"
                  checked={uiSettings.showFooter}
                  onCheckedChange={(checked) => setUiSettings({ ...uiSettings, showFooter: checked })}
                />
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        {renderContent()}
        <DrawerFooter>
          <Button onClick={handleSave}>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
