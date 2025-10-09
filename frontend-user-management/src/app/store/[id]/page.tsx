"use client"

import { useStoreData } from "~/hooks/use-store-data"
import { Hero } from "~/components/templates/template1/hero"
import { FeaturedProduct } from "~/components/templates/template1/featured-product"
import { ProductSection } from "~/components/templates/template1/product-section"
import { Footer } from "~/components/templates/template1/footer"
import { mockStore, mockStoreSettings, mockProducts } from "~/components/templates/template1/mock-data"

export default function StorePage() {
  const { store, storeSettings, products, isLoading } = useStoreData()

  // Use real data if available, otherwise fall back to mock data
  const currentStore = store || mockStore
  const currentSettings = storeSettings || mockStoreSettings
  const currentProducts = products.length > 0 ? products : mockProducts

  if (isLoading) {
    return <div>Loading...</div> // You might want to add a proper loading component
  }

  return (
    <div className="min-h-screen">
      <Hero store={currentStore} />
      <FeaturedProduct product={currentProducts[0]} />
      <ProductSection products={currentProducts} />
      <Footer store={currentStore} settings={currentSettings} />
    </div>
  )
}
