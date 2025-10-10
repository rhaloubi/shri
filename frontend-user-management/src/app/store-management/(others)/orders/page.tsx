"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OrderList } from "~/components/store-management/order/order-list"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Toaster, toast } from "sonner"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useSession } from "~/lib/auth-client"
import { getCookie } from "cookies-next"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import LoadingPage from "~/components/loading-page"

interface OrderItem {
  ID: string
  OrderID: string
  ProductID: string
  Quantity: number
  Price: number
  ProductName: string
}

interface Order {
  ID: string
  UserID: string
  OrderNumber: string
  Status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  TotalAmount: number
  ShippingAddressID: string
  CreatedAt: string
  UpdatedAt: string
  OrderItems: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const { data: session } = useSession()  // Updated to match products page
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const fetchOrders = async () => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    try {
      const token = getCookie("better-auth.jwt")
      if (!token) throw new Error("Authentication token not found")

      const response = await fetch(
        `/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchOrders()
  }, [session?.user?.id]) // Updated dependency array to match products page pattern

  if (!session) {
    return <LoadingPage />
  }

  const getStatusCount = (status: Order["Status"]) => {
    return orders.filter(order => order.Status === status).length
  }

  return (
    <div className="w-full space-y-6 p-3 sm:p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-sm sm:text-base lg:text-xl text-muted-foreground mt-2">
            View and manage your orders
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="sm:p-1">
            <CardHeader className="pb-1 sm:pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">All orders</p>
            </CardContent>
          </Card>

          <Card className="sm:p-1">
            <CardHeader className="pb-1 sm:pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{getStatusCount("pending")}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Pending orders</p>
            </CardContent>
          </Card>

          <Card className="sm:p-1">
            <CardHeader className="pb-1 sm:pb-2 space-y-0 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Delivered</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{getStatusCount("delivered")}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Delivered orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Order</Label>
            <Input
              id="search"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="status">Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status" className="max-w-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="-mx-4 sm:mx-0">
          <OrderList 
            orders={orders}
            searchQuery={searchQuery}
            statusFilter={selectedStatus}
          />
        </div>
      )}
    </div>
  )
}
