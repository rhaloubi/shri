"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { getCookie } from "cookies-next"
import { Toaster, toast } from "sonner"
import LoadingPage from "~/components/loading-page"
import { useSession } from "~/lib/auth-client"

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
  images: {
    ID: string
    URL: string
    AltText: string
    IsPrimary: boolean
    ProductID: string
  }[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const resolvedParams = React.use(params)
  const { data: session } = useSession()
  const productId = resolvedParams.id
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Category: '',
    Price: '',
    SKU: '',
    IsActive: true
  })

  useEffect(() => {
    fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      const response = await fetch(
        ` /api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }

      const product: Product = await response.json()
      setFormData({
        Name: product.Name,
        Description: product.Description,
        Category: product.Category,
        Price: product.Price.toString(),
        SKU: product.SKU,
        IsActive: product.IsActive
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product details')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error('Authentication token not found')

      // Validate required fields
      const requiredFields = ['Name', 'SKU', 'Price'] as const
      const missingFields = requiredFields.filter(field => !formData[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`)
      }

      const response = await fetch(
        `/api/products/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.Name,
            description: formData.Description,
            category: formData.Category,
            price: parseFloat(formData.Price),
            sku: formData.SKU,
            is_active: formData.IsActive
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to update product')
      }

      toast.success('Product updated successfully')
      router.push(`/store-management/products/${productId}`)
      router.refresh()
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return <LoadingPage />
  }

  return (
    <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <Toaster position="top-right" expand={true} richColors />
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            className="group relative p-2"
            onClick={() => router.push(`/store-management/products/${productId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="absolute left-10 bg-secondary text-secondary-foreground text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Back to Product
            </span>
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Edit Product</h1>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-card rounded-lg border p-3 sm:p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="Name">Name *</Label>
                <Input 
                  id="Name" 
                  placeholder="Product name" 
                  required 
                  className="max-w-xl"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="Description">Description</Label>
                <Textarea 
                  id="Description" 
                  placeholder="Product description" 
                  className="max-w-xl"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="Price">Price *</Label>
                  <Input 
                    id="Price" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    required
                    value={formData.Price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Category">Category</Label>
                  <Input 
                    id="Category" 
                    placeholder="Category" 
                    value={formData.Category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="SKU">SKU *</Label>
                  <Input 
                    id="SKU" 
                    placeholder="SKU" 
                    required
                    value={formData.SKU}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.IsActive ? "active" : "inactive"}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, IsActive: value === "active" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}