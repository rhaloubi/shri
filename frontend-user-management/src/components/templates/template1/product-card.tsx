import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import type { Product } from "~/hooks/use-store-data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Safely handle undefined images array
  const productImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border-4 border-transparent hover:border-black transition-all duration-300">
      {/* Badge - can be added as a property in the future if needed */}
      {product.category && (
        <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-full border-2 border-black">
          <span className="text-black font-black text-xs uppercase tracking-tight">{product.category}</span>
        </div>
      )}

      {/* Shopping bag button */}
      <button className="absolute top-4 right-4 z-10 w-12 h-12 bg-white rounded-full border-2 border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100">
        <ShoppingBag className="w-5 h-5 text-black" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#E5E5E5]">
        <Image
          src={productImage?.url || "/placeholder.svg"}
          alt={productImage?.altText || product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="p-5 space-y-3">
        <div>
          <h4 className="font-black text-xl text-black leading-tight mb-1">{product.name}</h4>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-black text-2xl text-black">${product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
