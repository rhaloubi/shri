"use client"

import { useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { ChevronLeft, ChevronRight, Eye, ShoppingBag, Search } from "lucide-react"
import { format } from "date-fns"

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

interface OrderListProps {
  orders: Order[]
  searchQuery: string
  statusFilter: string
}

export function OrderList({ orders, searchQuery, statusFilter }: OrderListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const itemsPerPage = 10

  const getStatusColor = (status: Order["Status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[status]
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Orders Found</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          There are no orders at this moment. When customers place orders, they will appear here.
        </p>
      </div>
    )
  }

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesSearch = searchQuery
          ? order.OrderNumber.toLowerCase().includes(searchQuery.toLowerCase())
          : true

        const matchesStatus = statusFilter
          ? order.Status === statusFilter
          : true

        return matchesSearch && matchesStatus
      })
      .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
  }, [orders, searchQuery, statusFilter])

  if (filteredOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Matching Orders</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          No orders match your current search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.ID}>
                <TableCell className="font-medium">{order.OrderNumber}</TableCell>
                <TableCell>{format(new Date(order.CreatedAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.Status)}>
                    {order.Status.charAt(0).toUpperCase() + order.Status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{order.OrderItems.length}</TableCell>
                <TableCell className="text-right">
                  ${order.TotalAmount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                  <p className="text-sm">{selectedOrder.OrderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedOrder.Status)}>
                    {selectedOrder.Status.charAt(0).toUpperCase() + selectedOrder.Status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm">
                    {format(new Date(selectedOrder.CreatedAt), "PPP")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-sm">${selectedOrder.TotalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Order Items</p>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.OrderItems.map((item) => (
                        <TableRow key={item.ID}>
                          <TableCell>{item.ProductName}</TableCell>
                          <TableCell className="text-right">{item.Quantity}</TableCell>
                          <TableCell className="text-right">${item.Price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${(item.Price * item.Quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}