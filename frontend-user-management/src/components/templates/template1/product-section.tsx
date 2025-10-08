"use client"

import { ProductCard } from "./product-card"
import { ChevronRight } from "lucide-react"
import { useRef } from "react"

const clothingProducts = [
  {
    id: "2",
    name: "Poppy Sweater",
    category: "Clothing",
    price: 250.0,
    description: "Recycled materials",
    image: "/pink-knit-sweater-on-model.jpg",
    colors: ["#FFB6C1", "#000000"],
    badge: "",
  },
  {
    id: "3",
    name: "Charlie Jacket",
    category: "Clothing",
    price: 350.0,
    description: "Limited edition",
    image: "/beige-puffer-jacket-on-model.jpg",
    colors: ["#F5DEB3", "#000000"],
    badge: "BEST SELLER",
  },
  {
    id: "4",
    name: "Blake Shorts",
    category: "Clothing",
    price: 175.0,
    description: "100% silk",
    image: "/black-silk-shorts-on-model.jpg",
    colors: ["#1a1a2e", "#F5F5DC"],
    badge: "",
  },
  {
    id: "5",
    name: "Harlow Coat",
    category: "Clothing",
    price: 700.0,
    description: "Ethically sourced",
    image: "/gray-wool-coat-on-model.jpg",
    colors: ["#808080"],
    badge: "SELLING FAST!",
  },
  {
    id: "6",
    name: "Jamie Dress",
    category: "Clothing",
    price: 220.0,
    description: "Locally made",
    image: "/elegant-black-dress-model.png",
    colors: ["#000000", "#FFFFFF"],
    badge: "",
  },
]

const accessoriesProducts = [
  {
    id: "7",
    name: "Leather Tote Bag",
    category: "Accessories",
    price: 195.0,
    description: "Handcrafted leather",
    image: "/brown-leather-tote-bag.jpg",
    colors: ["#8B4513", "#000000"],
    badge: "NEW",
  },
  {
    id: "8",
    name: "Gold Chain Necklace",
    category: "Accessories",
    price: 280.0,
    description: "18k gold plated",
    image: "/gold-chain-necklace.jpg",
    colors: ["#FFD700"],
    badge: "BEST SELLER",
  },
  {
    id: "9",
    name: "Silk Scarf",
    category: "Accessories",
    price: 165.0,
    description: "Pure silk",
    image: "/colorful-silk-scarf.png",
    colors: ["#FF6B6B", "#4ECDC4", "#FFE66D"],
    badge: "",
  },
  {
    id: "10",
    name: "Leather Belt",
    category: "Accessories",
    price: 145.0,
    description: "Italian leather",
    image: "/black-leather-belt.png",
    colors: ["#000000", "#8B4513"],
    badge: "",
  },
  {
    id: "11",
    name: "Sunglasses",
    category: "Accessories",
    price: 178.0,
    description: "UV protection",
    image: "/modern-sunglasses.jpg",
    colors: ["#000000"],
    badge: "SELLING FAST!",
  },
]

function ScrollableProductRow({
  title,
  products,
}: {
  title: string
  products: Array<{
    id: string
    name: string
    category: string
    price: number
    description: string
    image: string
    colors: string[]
    badge: string
  }>
}) {
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
        <h3 className="font-black text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tighter">{title}</h3>
        <button
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full bg-white border-4 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Scrollable container */}
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {products.map((product) => (
          <div key={product.id} className="flex-none w-[280px] sm:w-[320px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollableProductRow title="Clothing" products={clothingProducts} />
        <ScrollableProductRow title="Accessories" products={accessoriesProducts} />
      </div>
    </section>
  )
}
