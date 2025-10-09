import { Hero } from "./template2/hero"
import { FeaturedProduct } from "./template2/featured-product"
import { ProductSection } from "./template2/product-section"
import { Footer } from "./template2/footer"
import type { Store, StoreSettings, Product } from "~/hooks/use-store-data"

interface Template2Props {
  store: Store
  storeSettings: StoreSettings
  products: Product[]
}

export default function Template2({ store, storeSettings, products }: Template2Props) {
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
        <div className="py-16 text-center bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] text-white">
          <h2 className="text-2xl font-semibold mb-2">No Products Available</h2>
          <p>This store hasn't added any products yet.</p>
        </div>
      )}
      <Footer store={store} settings={storeSettings} />
    </div>
  )
}
