import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"

interface Image {
  id: string
  productId: string
  url: string
  altText: string
  isPrimary: boolean
}

interface Product {
  id: string
  storeId: string
  name: string
  description: string
  category: string
  price: number
  sku: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  images: Image[]
}

interface Store {
  id: string
  userID: string
  phoneNumber: string
  name: string
  description: string
  street: string
  city: string
  state: string
  logoURL: string
  createdAt: string
  updatedAt: string
}

interface StoreSettings {
  id: string
  storeId: string
  templateId: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
  showSearchBar: boolean
  showFooter: boolean
  createdAt: string
  updatedAt: string
}

interface UseStoreDataReturn {
  store: Store | null
  storeSettings: StoreSettings | null
  products: Product[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useStoreData(): UseStoreDataReturn {
  const params = useParams()
  const [store, setStore] = useState<Store | null>(null)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch store data
      const storeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${params.id}`)
      if (!storeResponse.ok) {
        throw new Error("Failed to fetch store data")
      }
      const storeData = await storeResponse.json()
      setStore(storeData)

      // Fetch store settings
      const settingsResponse = await fetch(`/api/store-settings/${params.id}`)
      if (!settingsResponse.ok) {
        throw new Error("Failed to fetch store settings")
      }
      const settingsData = await settingsResponse.json()
      setStoreSettings(settingsData)

      // Fetch products
      const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${storeData.userID}/stores`)
      if (!productsResponse.ok) {
        throw new Error("Failed to fetch products")
      }
      const productsData = await productsResponse.json()
      setProducts(productsData)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast.error("Error", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchAllData()
    }
  }, [params.id])

  return {
    store,
    storeSettings,
    products,
    isLoading,
    error,
    refetch: fetchAllData,
  }
}