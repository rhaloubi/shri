"use client"

import { Package, Tag, ShoppingBag, CheckCircle, XCircle, Trash2, Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"


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

interface ProductDetailsSectionProps {
  product: Product
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}

export function ProductDetailsSection({
  product,
  onEdit,
  onDelete,
  isDeleting
}: ProductDetailsSectionProps) {
  const formatPrice = (price: number) => {
    return price.toFixed(2)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.Name}</h1>
            <p className="text-sm text-gray-500">SKU: {product.SKU}</p>
          </div>
          <Badge
            variant={product.IsActive ? "default" : "destructive"}
            className={product.IsActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {product.IsActive ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-gray-600">
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            {product.Category}
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatPrice(product.Price)}dh
          </div>
        </div>
      </div>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-gray-500">{product.Category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">SKU </p>
                <p className="text-sm text-gray-500">{product.SKU}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Description</p>
            <p className="text-sm text-gray-500">{product.Description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={onEdit}
        >
          Edit Product
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex-1"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}