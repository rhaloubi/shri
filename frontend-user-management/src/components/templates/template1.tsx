import { Hero } from "./template1/hero"
import { FeaturedProduct } from "./template1/featured-product"
import { ProductSection } from "./template1/product-section"
import { Footer } from "./template1/footer"

export default function StorePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProduct />
      <ProductSection />
      <Footer />
    </div>
  )
}
