"use client"

import { useEffect, useRef } from "react"

export function Hero() {
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
    <section ref={heroRef} className="relative min-h-[80vh] overflow-hidden bg-black">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main heading with staggered animation */}
          <div className="space-y-4 opacity-0 translate-y-8 transition-all duration-1000 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:translate-y-0">
            <h1 className="font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white uppercase leading-[0.9] tracking-tighter">
              HELLA
              <br />
              GOODS
            </h1>
          </div>

          {/* Description with delayed animation */}
          <div className="opacity-0 translate-y-8 transition-all duration-1000 delay-300 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:translate-y-0">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Discover our curated collection of premium products that bring flavor, style, and quality to your everyday
              life. Experience the extraordinary.
            </p>
          </div>

          {/* CTA Button with delayed animation */}
          <div className="opacity-0 translate-y-8 transition-all duration-1000 delay-500 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:translate-y-0">
            <button className="group relative px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-tight rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Decorative line with animation */}
          <div className="pt-12 opacity-0 scale-x-0 transition-all duration-1000 delay-700 ease-out [.animate-in_&]:opacity-100 [.animate-in_&]:scale-x-100">
            <div className="h-px w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
