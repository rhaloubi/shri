"use client"

import { useRef } from "react"
import { ChevronRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product, StoreSettings } from "~/hooks/use-store-data"

interface ScrollableProductRowProps {
  title: string
  products: Product[]
  settings: StoreSettings
}

function ScrollableProductRow({ title, products, settings }: ScrollableProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="mb-16">
      <div className="mb-8 flex items-center justify-between">
        <h3 
          className="font-black text-3xl sm:text-4xl md:text-5xl uppercase bg-white tracking-tighter"
        >
          {title}
        </h3>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          style={{ 
            backgroundColor: settings.secondaryColor,
            borderColor: settings.primaryColor,
            borderWidth: '4px'
          }}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" style={{ color: settings.primaryColor }} />
        </button>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[280px] sm:w-[320px]">
            <ProductCard product={product} settings={settings} />
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
    const category = product.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  return (
    <section 
      className="py-16 sm:py-24 lg:py-32"
      style={{ backgroundColor: settings.secondaryColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <ScrollableProductRow 
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
