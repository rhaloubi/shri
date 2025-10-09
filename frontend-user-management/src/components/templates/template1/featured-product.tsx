import Image from "next/image"
import { Button } from "~/components/ui/button"
import type { Product, StoreSettings } from "~/hooks/use-store-data"

interface FeaturedProductProps {
  product: Product
  settings: StoreSettings
}

export function FeaturedProduct({ product, settings }: FeaturedProductProps) {
  const productImage = product.images?.find(img => img.isPrimary) || product.images?.[0]

  return (
    <section className="py-16 sm:py-24 lg:py-32" style={{ backgroundColor: settings.secondaryColor }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 
            className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter text-center"
            style={{ color: settings.primaryColor }}
          >
            PRODUCT OF THE MONTH
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
          <div className="relative">
            <div className="flex gap-4">
              <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden border-8 bg-[#E5E5E5]"
                style={{ borderColor: settings.primaryColor }}>
                <Image
                  src={productImage?.URL || "/placeholder.svg"}
                  alt={productImage?.AltText || product.Name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 relative">
            <div className="absolute -top-8 right-0 lg:-right-12">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl uppercase tracking-tight rotate-12" 
                    style={{ color: settings.secondaryColor, fontWeight: 900 }}>
                    NEW!
                  </span>
                </div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-6 h-6"
                    style={{
                      backgroundColor: settings.primaryColor,
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${i * 45}deg) translate(50px, -50%)`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 
                className="font-black text-5xl sm:text-6xl md:text-7xl uppercase leading-none tracking-tighter mb-6"
                style={{ color: settings.primaryColor }}
              >
                {product.Name}
              </h3>
              <p className="text-2xl font-black mb-4" style={{ color: settings.primaryColor }}>
                ${(product.Price ?? 0).toFixed(2)}
              </p>
              <p className="text-base leading-relaxed" style={{ color: settings.primaryColor }}>
                {product.Description}
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button
                size="lg"
                variant="outline"
                className="w-full text-xl px-8 py-7 hover:bg-gray-50 font-black uppercase tracking-tight rounded-full"
                style={{ 
                  backgroundColor: settings.secondaryColor,
                  color: settings.primaryColor,
                  borderColor: settings.primaryColor,
                  borderWidth: '4px'
                }}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
