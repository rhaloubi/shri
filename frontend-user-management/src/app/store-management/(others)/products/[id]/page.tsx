"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import * as React from "react"
import { getCookie } from "cookies-next"

import { Button } from "~/components/ui/button"
import { ProductImageGallery } from "~/components/store-management/product/product-image-gallery"
import { ProductDetailsSection } from "~/components/store-management/product/product-details-section"
import LoadingPage from "~/components/loading-page"
import { useSession } from "~/lib/auth-client"

interface ProductImage {
  ID: string
  URL: string
  AltText: string
  IsPrimary: boolean
  ProductID: string
}

interface Product {
  ID: string
  Name: string
  Description: string
  Category: string
  Price: number
  SKU: string
  IsActive: boolean
  StoreID: string
  CreatedAt: string
  UpdatedAt: string
  images: ProductImage[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { id: productId } = React.use(params)
  const { data: session } = useSession()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch product')
      
      const data = await response.json()
      if (Array.isArray(data)) {
        setProduct(data[0])
      } else if (data.data) {
        setProduct(data.data)
      } else {
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddImages = async (files: File[]) => {
    if (!product) return

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      // Upload each image individually since the backend expects single file uploads
      for (const file of files) {
        const formData = new FormData()
        formData.append('image', file)  // Changed from 'images' to 'image'
        formData.append('altText', '')  // Add default alt text

        const response = await fetch(
          `/api/products/${productId}/images`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData
          }
        )

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }
      }

      await fetchProduct()
      toast.success('Images uploaded successfully')
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload images')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!product) return

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(
        `/api/products/${productId}/images/${imageId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      await fetchProduct()
      toast.success('Image deleted successfully')
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete image')
    }
  }

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!product) return

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(
        ` /api/products/${productId}/images/${imageId}/primary`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to set primary image')
      }

      await fetchProduct()
      toast.success('Primary image updated successfully')
    } catch (error) {
      console.error('Error setting primary image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to set primary image')
    }
  }

  const handleUpdateImageAltText = async (imageId: string, altText: string) => {
    if (!product) return

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(
        `/api/products/${productId}/images/${imageId}/alt-text`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ alt_text: altText })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update image alt text')
      }

      await fetchProduct()
      toast.success('Image alt text updated successfully')
    } catch (error) {
      console.error('Error updating image alt text:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update image alt text')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast.success('Product deleted successfully')
      router.push('/store-management/products')
      router.refresh()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return <LoadingPage />
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button onClick={() => router.push('/store-management/products')}>Back to Products</Button>
      </div>
    )
  }

  return (
    <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <Toaster position="top-right" expand={true} richColors />
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            className="group relative p-2"
            onClick={() => router.push('/store-management/products')}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="absolute left-10 bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Back to Products
            </span>
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Product Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductImageGallery
            images={product.images}
            onAddImages={handleAddImages}
            onDeleteImage={handleDeleteImage}
            onSetPrimaryImage={handleSetPrimaryImage}
            onUpdateAltText={handleUpdateImageAltText}
          />
          <ProductDetailsSection
            product={product}
            onEdit={() => router.push(`/store-management/products/${product.ID}/edit`)}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </main>
  )
}