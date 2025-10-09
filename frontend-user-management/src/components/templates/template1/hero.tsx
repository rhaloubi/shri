"use client"

import { useEffect, useRef } from "react"
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
      { threshold: 0.1 },
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-[80vh] bg-black overflow-hidden"
      
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:translate-y-0">
            <h1 
              className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.9] tracking-tighter"
              style={{ color: settings.secondaryColor }}
            >
              {store.name}
            </h1>
          </div>

          <div className="opacity-0 translate-y-8 transition-all duration-1000 delay-300 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:translate-y-0">
            <p 
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
              style={{ color: settings.secondaryColor }}
            >
              {store.description}
            </p>
          </div>

          <div className="opacity-0 translate-y-8 transition-all duration-1000 delay-500 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:translate-y-0">
            <button 
              className="group relative px-8 py-4 font-bold text-lg uppercase tracking-tight rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ 
                backgroundColor: settings.secondaryColor,
                color: settings.primaryColor
              }}
            >
              <span className="relative z-10">Shop Now</span>
            </button>
          </div>
          <div className="pt-12 opacity-0 scale-x-0 transition-all duration-1000 delay-700 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:scale-x-100">
            <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
