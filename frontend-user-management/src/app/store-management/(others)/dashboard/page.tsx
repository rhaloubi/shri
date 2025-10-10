"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Toaster, toast } from "sonner"
import { useSession } from "~/lib/auth-client"
import { getCookie } from "cookies-next"
import { Building2, Package, ShoppingCart, MapPin, Store, TrendingUp } from "lucide-react"
import LoadingPage from "~/components/loading-page"
import { LockSections } from "~/components/store-management/lock-sections"

interface Product {
  ID: string
  Name: string
  Description: string
  Category: string
  Price: number
  SKU: string
  IsActive: boolean
  StoreID: string
  CreatedAt: string
  UpdatedAt: string
}

interface StoreDetails {
  ID: string
  Name: string
  Description: string
  Street: string
  City: string
  State: string
  IsActive: boolean
}

interface Order {
  ID: string
  Status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  TotalAmount: number
  CreatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [hasStore, setHasStore] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [storeData, setStoreData] = useState<{
    products: Product[]
    store: StoreDetails | null
    orders: Order[]
  }>({
    products: [],
    store: null,
    orders: []
  })

  // Check if user has a store
  useEffect(() => {
    const checkStore = async () => {
      try {
        const token = getCookie('better-auth.jwt')
        if (!token) {
          setHasStore(false)
          return
        }

        const res = await fetch(`/api/stores/has-store`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })

        if (!res.ok) {
          setHasStore(false)
          return
        }

        const data = await res.json()
        setHasStore(data.hasStore)

        if (data.hasStore) {
          await fetchStoreData()
        }
      } catch (error) {
        console.error('Error checking store status:', error)
        setHasStore(false)
      } finally {
        setLoading(false)
      }
    }

    void checkStore()
  }, [])

  const fetchStoreData = async () => {
    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error("Authentication token not found")

      // Fetch all data in parallel
      const [productsRes, storeRes, ordersRes] = await Promise.all([
        fetch(`/api/products/${session?.user?.id}/stores`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`/api/stores`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const [products, storeDetails, orders] = await Promise.all([
        productsRes.json(),
        storeRes.json(),
        ordersRes.json()
      ])
      setStoreData({
        products: Array.isArray(products) ? products : products.data || [],
        store: Array.isArray(storeDetails) ? storeDetails[0] : storeDetails,
        orders: orders
      })
    } catch (error) {
      console.error("Error fetching store data:", error)
      toast.error("Failed to load store data")
    }
  }

  if (!session) {
    return <LoadingPage />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasStore) {
    return <LockSections />
  }

  // Calculate statistics
  const totalProducts = storeData.products.length
  const totalOrders = storeData.orders.length
  const averagePrice = storeData.products.length > 0
    ? storeData.products.reduce((acc, product) => acc + product.Price, 0) / totalProducts
    : 0
  const categories = [...new Set(storeData.products.map(product => product.Category))]
  const pendingOrders = storeData.orders.filter(order => order.Status === "pending").length
  const totalRevenue = storeData.orders.reduce((acc, order) => acc + order.TotalAmount, 0)

  return (
    <div className="w-full space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" expand={true} richColors />
      
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Welcome to {storeData.store?.Name || "Your Store"}
        </h1>
        <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mt-2">
          Here's an overview of your store's performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across {categories.length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Price
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePrice.toFixed(2)} DH</div>
            <p className="text-xs text-muted-foreground">
              Per product
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders} pending orders
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Store Location
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {storeData.store?.Street}
            </div>
            <p className="text-sm text-muted-foreground">
              {storeData.store?.City}, {storeData.store?.State}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} DH</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Popular Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categories.map(category => {
                const productsInCategory = storeData.products.filter(p => p.Category === category)
                const categoryAverage = productsInCategory.reduce((acc, p) => acc + p.Price, 0) / productsInCategory.length
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground">
                      {categoryAverage.toFixed(2)} DH avg.
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {storeData.orders.slice(0, 5).map(order => (
                <div key={order.ID} className="flex justify-between items-center">
                  <span className="text-sm font-medium">Order #{order.ID.slice(0, 8)}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.CreatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
