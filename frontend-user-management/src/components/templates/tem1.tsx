import { Hero } from "./template1/hero"
import { FeaturedProduct } from "./template1/featured-product"
import { ProductSection } from "./template1/product-section"
import { Footer } from "./template1/footer"
import type { Store, StoreSettings, Product } from "~/hooks/use-store-data"

interface Template1Props {
  store: Store
  storeSettings: StoreSettings
  products: Product[]
}

export default function Template1({ store, storeSettings, products }: Template1Props) {
  return (
    <div className="min-h-screen" style={{ fontFamily: storeSettings?.fontFamily }}>
      <Hero store={store} settings={storeSettings} />
      {products.length > 0 && (
        <>
          <FeaturedProduct product={products[0]} settings={storeSettings} />
          <ProductSection products={products} settings={storeSettings} />
        </>
      )}
      {products.length === 0 && (
        <div className="py-16 text-center bg-white">
          <h2 className="text-2xl font-semibold mb-2">No Products Available</h2>
          <p>This store hasn't added any products yet.</p>
        </div>
      )}
      <Footer store={store} settings={storeSettings} />
    </div>
  )
}
