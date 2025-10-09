import Image from "next/image"
import { Star, ShoppingBag } from "lucide-react"
import type { Product, StoreSettings } from "~/hooks/use-store-data"

interface FeaturedProductProps {
  product: Product
  settings: StoreSettings
}

export function FeaturedProduct({ product, settings }: FeaturedProductProps) {
  const productImage = product.images?.find(img => img.IsPrimary) || product.images?.[0]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="text-5xl font-black mb-4"
            style={{ color: settings.primaryColor }}
          >
            Featured Product
          </h2>
          <p className="text-xl text-gray-600">This month's must-have item</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="relative group">
            <div 
              className="absolute inset-0 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"
              style={{ backgroundColor: settings.primaryColor }}
            />
            <div className="relative bg-gray-100 rounded-3xl overflow-hidden aspect-square">
              <Image
                src={productImage?.URL || "/placeholder.svg"}
                alt={productImage?.AltText || product.Name}
                fill
                className="object-cover"
              />
            </div>
            {product.category && (
              <div 
                className="absolute top-6 right-6 px-4 py-2 rounded-full font-bold text-sm"
                style={{ 
                  backgroundColor: settings.primaryColor,
                  color: settings.secondaryColor
                }}
              >
                {product.category}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div 
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: `${settings.primaryColor}20`,
                color: settings.primaryColor
              }}
            >
              Premium Collection
            </div>

            <h3 
              className="text-4xl font-black"
              style={{ color: settings.primaryColor }}
            >
              {product.name}
            </h3>


            <p className="text-lg text-gray-600 leading-relaxed">
              {product.Description}
            </p>

            <div className="flex items-baseline gap-3">
              <span 
                className="text-5xl font-black"
                style={{ color: settings.primaryColor }}
              >
                ${(product.Price ?? 0).toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              <button 
                className="w-full py-4 rounded-full font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2"
                style={{ 
                  backgroundColor: settings.primaryColor,
                  color: settings.secondaryColor
                }}
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
