"use client"

import { useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import type { Store, StoreSettings } from "~/hooks/use-store-data"

interface HeroProps {
  store: Store
  settings: StoreSettings
}

export function Hero({ store, settings }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-20 blur-3xl" 
        style={{ backgroundColor: settings.primaryColor }} />
      <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: settings.secondaryColor }} />

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="inline-block mb-6 px-6 py-2 rounded-full text-sm font-semibold animate-fade-in"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Welcome to our Store
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight animate-fade-in-up">
            {store.name}
            <br />
            <span style={{ color: settings.primaryColor }}>Premium Store</span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200 text-gray-300">
            {store.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button 
              className="px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 group"
              style={{ 
                backgroundColor: settings.primaryColor,
                color: settings.secondaryColor
              }}
            >
              Shop Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="border-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300"
              style={{ 
                borderColor: settings.primaryColor,
                color: settings.primaryColor
              }}
            >
              View Collection
            </button>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
