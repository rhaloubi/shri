"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ImagePlus, X, ArrowLeft, Star } from "lucide-react"
import Image from "next/image"
import { getCookie } from "cookies-next"
import { Toaster, toast } from "sonner"

const MAX_IMAGES = 10

type ImageEntry = {
  file: File
  url: string
  altText: string
  isPrimary: boolean
}

interface ApiError {
  message: string
}

interface ApiErrorResponse {
  data: {
    message: string
  }
}

export default function AddProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<ImageEntry[]>([])
  const [formData, setFormData] = useState({
    storeId: "",
    name: "",
    description: "",
    category: "",
    price: "",
    sku: "",
    isActive: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) return

    const files = Array.from(fileList)
    const remainingSlots = MAX_IMAGES - images.length

    if (files.length > remainingSlots) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images`)
      return
    }

    const newImages: ImageEntry[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      altText: "",
      isPrimary: images.length === 0, // First image is primary by default
    }))

    setImages((prev) => [...prev, ...newImages])
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      URL.revokeObjectURL(prev[index].url)

      if (prev[index].isPrimary && updated.length > 0) {
        updated[0].isPrimary = true
      }

      return updated
    })
  }

  const updateImageAltText = (index: number, altText: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, altText } : img)))
  }

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    )
  }

  React.useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.url))
  }, [images])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error("Authentication token not found")

      const requiredFields = ["storeId", "name", "category", "price", "sku"]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(", ")}`)
      }

      if (images.length === 0) {
        throw new Error("Please upload at least one image")
      }

      const hasPrimary = images.some((img) => img.isPrimary)
      if (!hasPrimary && images.length > 0) {
        images[0].isPrimary = true
      }

      const formDataToSend = new FormData()

      formDataToSend.append("store_id", formData.storeId)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("sku", formData.sku)
      formDataToSend.append("is_active", formData.isActive.toString())

      images.forEach((image, index) => {
        formDataToSend.append("images", image.file)
        formDataToSend.append(`image_alt_text_${index}`, image.altText)
        formDataToSend.append(`image_is_primary_${index}`, image.isPrimary.toString())
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
        cache: 'no-store'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create product")
      }

      toast.success("Product created successfully")
      router.push("/products")
      router.refresh()
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <Toaster position="top-right" expand={true} richColors />
      <div className="w-full">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" className="group relative p-2" onClick={() => router.push("/products")}>
            <ArrowLeft className="h-5 w-5" />
            <span className="absolute left-10 bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Back to Products
            </span>
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Product</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 pb-3 border-b">
          Add a new product to your inventory.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-card rounded-lg border p-3 sm:p-4 md:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">Product Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeId">Store ID *</Label>
                  <Input
                    id="storeId"
                    placeholder="Store identifier"
                    required
                    className="max-w-xl"
                    value={formData.storeId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Product name"
                    required
                    className="max-w-xl"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description"
                    className="max-w-xl min-h-[100px]"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      type="text"
                      placeholder="e.g., Electronics, Clothing"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Stock Keeping Unit"
                    required
                    className="max-w-xl"
                    value={formData.sku}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    value={formData.isActive.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, isActive: value === "true" }))}
                  >
                    <SelectTrigger className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-3 sm:p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold">Product Images</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Upload up to {MAX_IMAGES} images. {images.length} of {MAX_IMAGES} used.
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleImageSelect}
                />

                {images.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {images.map((image, index) => (
                        <div key={image.url} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                          <div className="relative group aspect-square w-full sm:w-32 h-32 flex-shrink-0">
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt={image.altText || `Product image ${index + 1}`}
                              fill
                              className="rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {image.isPrimary && (
                              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current" />
                                Primary
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`alt-text-${index}`}>Alt Text</Label>
                              <Input
                                id={`alt-text-${index}`}
                                placeholder="Describe this image for accessibility"
                                value={image.altText}
                                onChange={(e) => updateImageAltText(index, e.target.value)}
                              />
                            </div>
                            {!image.isPrimary && (
                              <Button type="button" variant="outline" size="sm" onClick={() => setPrimaryImage(index)}>
                                <Star className="h-4 w-4 mr-2" />
                                Set as Primary
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {images.length < MAX_IMAGES && (
                      <div className="mt-4 flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                          className="w-full max-w-xs"
                        >
                          <ImagePlus className="h-4 w-4 mr-2" />
                          Add more images
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                      <p className="text-sm font-medium">Drop your images here</p>
                      <p className="text-xs text-muted-foreground">PNG or JPG (max. 5MB)</p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        Select images
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
              Discard
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
