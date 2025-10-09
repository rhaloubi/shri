"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BlueProductCard } from "./product-card"
import type { Product, StoreSettings } from "~/hooks/use-store-data"

interface ScrollableProductRowProps {
  title: string
  products: Product[]
  settings: StoreSettings
}

function CategoryRow({ title, products, settings }: ScrollableProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="mb-20 last:mb-0">
      <div className="flex items-center justify-between mb-8">
        <h2 
          className="text-4xl font-black"
          style={{ color: settings.primaryColor }}
        >
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full text-white transition-colors"
            style={{ 
              backgroundColor: settings.primaryColor,
              '&:hover': {
                backgroundColor: settings.secondaryColor
              }
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full text-white transition-colors"
            style={{ 
              backgroundColor: settings.primaryColor,
              '&:hover': {
                backgroundColor: settings.secondaryColor
              }
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className="flex-none w-[280px] sm:w-[320px]">
            <BlueProductCard product={product} settings={settings} />
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProductSectionProps {
  products: Product[]
  settings: StoreSettings
}

export function ProductSection({ products, settings }: ProductSectionProps) {
  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.Category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <CategoryRow 
            key={category} 
            title={category} 
            products={categoryProducts}
            settings={settings}
          />
        ))}
      </div>
    </section>
  )
}
