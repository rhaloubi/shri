import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import type { Product, StoreSettings } from "~/hooks/use-store-data"

interface ProductCardProps {
  product: Product
  settings: StoreSettings
}

export function BlueProductCard({ product, settings }: ProductCardProps) {
  const productImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <div className="flex-shrink-0 w-80 group">
      <div 
        className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent"
        style={{ 
          '&:hover': {
            borderColor: settings.primaryColor
          }
        }}
      >
        {/* Category Badge */}
        {product.Category && (
          <div 
            className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: settings.primaryColor,
              color: settings.secondaryColor
            }}
          >
            {product.Category}
          </div>
        )}

        {/* Image */}
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
          <Image
            src={productImage?.URL || "/placeholder.svg"}
            alt={productImage?.AltText || product.Name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Quick add button */}
          <button 
            className="absolute bottom-4 right-4 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ 
              backgroundColor: settings.secondaryColor,
              color: settings.primaryColor,
              '&:hover': {
                backgroundColor: settings.primaryColor,
                color: settings.secondaryColor
              }
            }}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6">
          <p 
            className="text-sm font-semibold mb-2"
            style={{ color: settings.primaryColor }}
          >
            {product.Category}
          </p>
          <h3 
            className="text-xl font-bold mb-3"
            style={{ color: settings.primaryColor }}
          >
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span 
              className="text-2xl font-black"
              style={{ color: settings.primaryColor }}
            >
              ${(product.Price ?? 0).toFixed(2)}
            </span>
            <button 
              className="text-sm font-semibold transition-colors"
              style={{ 
                color: settings.primaryColor,
                '&:hover': {
                  color: settings.secondaryColor
                }
              }}
            >
              View Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
