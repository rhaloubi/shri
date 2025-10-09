import Image from "next/image"
import { Button } from "~/components/ui/button"
import type { Product } from "~/hooks/use-store-data"

interface FeaturedProductProps {
  product: Product
}


export function FeaturedProduct({ product }: FeaturedProductProps) {
  // Safely handle undefined images array
  const productImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12">
          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black uppercase tracking-tighter text-center">
            PRODUCT OF THE MONTH
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="relative">
            <div className="flex gap-4">
              {/* Main image */}
              <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden border-8 border-black bg-[#E5E5E5]">
                <Image
                  src={productImage?.url || "/placeholder.svg"}
                  alt={productImage?.altText || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 relative">
            {/* NEW badge */}
            <div className="absolute -top-8 right-0 lg:-right-12">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-[#FFE547] rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-black font-black text-2xl uppercase tracking-tight rotate-12">NEW!</span>
                </div>
                {/* Star points */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6 bg-[#FFE547]"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 45}deg) translate(50px, -50%)`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-5xl sm:text-6xl md:text-7xl text-black uppercase leading-none tracking-tighter mb-6">
                {product.name}
              </h3>
              <p className="text-2xl font-black text-black mb-4">${product.price.toFixed(2)}</p>
              <p className="text-base text-black leading-relaxed">{product.description}</p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                size="lg"
                variant="outline"
                className="w-full text-xl px-8 py-7 bg-white hover:bg-gray-50 text-black border-4 border-black font-black uppercase tracking-tight rounded-full"
              >
                ADD TO CART
              </Button>
              <Button
                size="lg"
                className="w-full text-xl px-8 py-7 bg-[#C4F547] hover:bg-[#B5E538] text-black border-4 border-black font-black uppercase tracking-tight rounded-full"
              >
                BUY IT NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
