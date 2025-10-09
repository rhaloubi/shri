import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import type { Product, StoreSettings } from "~/hooks/use-store-data"

interface ProductCardProps {
  product: Product
  settings: StoreSettings
}

export function ProductCard({ product, settings }: ProductCardProps) {
  const productImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <div 
      className="group relative rounded-3xl overflow-hidden border-4 border-transparent hover:border-black transition-all duration-300"
      style={{ 
        backgroundColor: settings.secondaryColor,
        borderColor: 'transparent',
        '&:hover': {
          borderColor: settings.primaryColor
        }
      }}
    >
      {product.Category && (
        <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full border-2"
          style={{ 
            backgroundColor: settings.secondaryColor,
            borderColor: settings.primaryColor
          }}>
          <span className="text-xs uppercase tracking-tight" 
            style={{ color: settings.primaryColor, fontWeight: 900 }}>
            {product.Category}
          </span>
        </div>
      )}

      <button 
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          backgroundColor: settings.secondaryColor,
          borderColor: settings.primaryColor
        }}
      >
        <ShoppingBag className="w-5 h-5" style={{ color: settings.primaryColor }} />
      </button>

      <div className="relative aspect-[4/5] overflow-hidden bg-[#E5E5E5]">
        <Image
          src={productImage?.URL || "/placeholder.svg"}
          alt={productImage?.AltText || product.Name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 space-y-3">
        <div>
          <h4 
            className="font-black text-xl leading-tight mb-1"
            style={{ color: settings.primaryColor }}
          >
            {product.Name}
          </h4>
          <p className="text-sm" style={{ color: settings.primaryColor }}>
            {product.Description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span 
            className="font-black text-2xl"
            style={{ color: settings.primaryColor }}
          >
            ${product.Price?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
