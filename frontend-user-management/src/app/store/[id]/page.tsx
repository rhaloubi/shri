"use client"

import { useStoreData } from "~/hooks/use-store-data"
import Template1 from "~/components/templates/tem1"
import Template2 from "~/components/templates/tem2"
import { mockStore, mockStoreSettings, mockProducts } from "~/components/templates/template1/mock-data"

export default function StorePage() {
  const { store, storeSettings, products, isLoading } = useStoreData()

  // Use mock data for store and settings only if both are missing
  const shouldUseMockStoreData = !store && !storeSettings
  const currentStore = shouldUseMockStoreData ? mockStore : store
  const currentSettings = shouldUseMockStoreData ? mockStoreSettings : storeSettings
  const currentProducts = products || []
  console.log(currentProducts)
  if (isLoading) {
    return <div>Loading...</div>
  }

  // Render template based on templateId
  if (currentSettings?.templateId === 'classic') {
    return (
      <Template1 
        store={currentStore} 
        storeSettings={currentSettings}
        products={currentProducts}
      />
    )
  }

  // Default template
  return (
    <Template2 
      store={currentStore} 
      storeSettings={currentSettings}
      products={currentProducts}
    />
  )
}
