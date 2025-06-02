"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Printer, Send, Package, CheckCircle, Clock, MoreVertical } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef } from "react"
import { EditOrderModal } from "@/components/modals/edit-order-modal"
import { InvoicePrint } from "@/components/invoice-print"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { t } = useLanguage()

  // In a real app, you would fetch this data based on params.id
  const order = {
    id: "ORD-001",
    orderNumber: "2024-001",
    status: "Processing",
    customer: {
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Solutions Inc.",
    },
    shippingAddress: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    billingAddress: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    orderDate: "2024-01-15",
    expectedDelivery: "2024-01-22",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    items: [
      {
        id: "1",
        name: "Laptop Dell XPS 13",
        sku: "DELL-XPS13-001",
        category: "Electronics",
        quantity: 2,
        unitPrice: 1299,
        total: 2598,
        image: "/placeholder.svg",
      },
      {
        id: "2",
        name: "Wireless Mouse",
        sku: "MOUSE-WL-001",
        category: "Accessories",
        quantity: 3,
        unitPrice: 35,
        total: 105,
        image: "/placeholder.svg",
      },
    ],
    subtotal: 2703,
    tax: 270.3,
    shipping: 0,
    discount: 0,
    total: 2973.3,
    notes: "Please handle with care. Fragile electronics.",
    timeline: [
      {
        status: "Order Placed",
        date: "2024-01-15 10:30 AM",
        description: "Order has been placed successfully",
        completed: true,
      },
      {
        status: "Payment Confirmed",
        date: "2024-01-15 10:35 AM",
        description: "Payment has been processed",
        completed: true,
      },
      {
        status: "Processing",
        date: "2024-01-15 02:00 PM",
        description: "Order is being prepared",
        completed: true,
      },
      {
        status: "Shipped",
        date: "Expected: 2024-01-18",
        description: "Order will be shipped",
        completed: false,
      },
      {
        status: "Delivered",
        date: "Expected: 2024-01-22",
        description: "Order will be delivered",
        completed: false,
      },
    ],
  }

  const [showEditModal, setShowEditModal] = useState(false)
  const [orderData, setOrderData] = useState(order)
  const printRef = useRef<HTMLDivElement>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Completed":
        return t("orders.status.completed")
      case "Processing":
        return t("orders.status.processing")
      case "Shipped":
        return t("orders.status.shipped")
      case "Pending":
        return t("orders.status.pending")
      case "Cancelled":
        return t("orders.status.cancelled")
      default:
        return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "Paid":
        return t("orders.paymentStatus.paid")
      case "Pending":
        return t("orders.paymentStatus.pending")
      case "Failed":
        return t("orders.paymentStatus.failed")
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "Credit Card":
        return t("orders.paymentMethod.creditCard")
      case "Debit Card":
        return t("orders.paymentMethod.debitCard")
      case "Bank Transfer":
        return t("orders.paymentMethod.bankTransfer")
      case "Cash":
        return t("orders.paymentMethod.cash")
      case "PayPal":
        return t("orders.paymentMethod.paypal")
      default:
        return method
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${orderData.orderNumber}</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                @media print {
                  @page { margin: 0.5in; size: A4; }
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    }
  }

  const handleSaveOrder = (updatedOrder: any) => {
    setOrderData(updatedOrder)
    // Here you would typically send the updated order to your backend
    console.log("Order updated:", updatedOrder)
  }

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Mobile-Optimized Header */}
        <div className="space-y-4">
          {/* Top Row - Back Button and Actions */}
          <div className="flex items-center justify-between">
            <Link href="/orders">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t("orders.backToOrders")}</span>
                <span className="sm:hidden">Quay lại</span>
              </Button>
            </Link>

            {/* Desktop Actions */}
            <div className="hidden md:flex space-x-2">
              <Button variant="outline" onClick={() => setShowEditModal(true)}>
                <Edit className="mr-2 h-4 w-4" />
                {t("orders.editOrder")}
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                {t("orders.printInvoice")}
              </Button>
              <Button variant="outline">
                <Send className="mr-2 h-4 w-4" />
                {t("orders.sendInvoice")}
              </Button>
            </div>

            {/* Mobile Actions Dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    In hóa đơn
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    Gửi hóa đơn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("orders.title")} {orderData.orderNumber}
              </h2>
              <Badge className={getStatusColor(orderData.status)}>{getStatusText(orderData.status)}</Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">{t("orders.orderDetails")}</p>
          </div>
        </div>

        {/* Order Status and Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.status")}:</span>
                  <Badge className={getStatusColor(orderData.status)}>{getStatusText(orderData.status)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.paymentStatus")}:</span>
                  <Badge className={getPaymentStatusColor(orderData.paymentStatus)}>
                    {getPaymentStatusText(orderData.paymentStatus)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.orderDate")}:</span>
                  <span className="text-sm font-medium">{orderData.orderDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.expectedDelivery")}:</span>
                  <span className="text-sm font-medium">{orderData.expectedDelivery}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.customerInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt={orderData.customer.name} />
                  <AvatarFallback>{getInitials(orderData.customer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{orderData.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{orderData.customer.company}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Email: </span>
                  <span>{orderData.customer.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone: </span>
                  <span>{orderData.customer.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("orders.subtotal")}:</span>
                  <span>{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("orders.tax")}:</span>
                  <span>{formatCurrency(orderData.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("orders.shipping")}:</span>
                  <span>{orderData.shipping === 0 ? t("orders.free") : formatCurrency(orderData.shipping)}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("orders.discount")}:</span>
                    <span>-{formatCurrency(orderData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{t("orders.total")}:</span>
                  <span>{formatCurrency(orderData.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>{t("orders.orderItems")}</CardTitle>
            <CardDescription>Products included in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                    <Badge variant="outline" className="mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.quantity")}</p>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.unitPrice")}</p>
                    <p className="font-medium">{formatCurrency(item.unitPrice)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.total")}</p>
                    <p className="font-bold">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Addresses and Timeline */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Addresses */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("orders.shippingAddress")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{orderData.customer.name}</p>
                  <p>{orderData.shippingAddress.street}</p>
                  <p>
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                    {orderData.shippingAddress.zipCode}
                  </p>
                  <p>{orderData.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("orders.billingAddress")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{orderData.customer.name}</p>
                  <p>{orderData.billingAddress.street}</p>
                  <p>
                    {orderData.billingAddress.city}, {orderData.billingAddress.state} {orderData.billingAddress.zipCode}
                  </p>
                  <p>{orderData.billingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {orderData.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("orders.orderNotes")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{orderData.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.orderTimeline")}</CardTitle>
              <CardDescription>{t("orders.trackProgress")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.timeline.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-500"}`}>
                        {step.status}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("orders.paymentInformation")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.paymentMethod")}</p>
                <p className="font-medium">{getPaymentMethodText(orderData.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.paymentStatus")}</p>
                <Badge className={getPaymentStatusColor(orderData.paymentStatus)}>
                  {getPaymentStatusText(orderData.paymentStatus)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.totalAmount")}</p>
                <p className="font-bold text-lg">{formatCurrency(orderData.total)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden Print Component */}
        <div className="hidden">
          <InvoicePrint ref={printRef} order={orderData} />
        </div>

        {/* Edit Order Modal */}
        <EditOrderModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          order={orderData}
          onSave={handleSaveOrder}
        />
      </div>
    </ERPLayout>
  )
}
