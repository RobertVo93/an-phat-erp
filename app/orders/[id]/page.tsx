"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Printer, Send, Package, MoreVertical, Loader2 } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, useEffect } from "react"
import { EditOrderModal } from "@/components/modals/edit-order-modal"
import { InvoicePrint } from "@/components/invoice-print"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Order } from "@/types/order"
import { getOrderById, updateOrder as apiUpdateOrder } from "@/lib/httpclient/order.client"
import { useParams } from "next/navigation"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { formatDate } from "@/lib/utils"

export default function OrderDetailPage() {
  const { t } = useLanguage()

  const [showEditModal, setShowEditModal] = useState(false)
  const [orderData, setOrderData] = useState<Order>()
  const printRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const params = useParams()
  const [subtotal, setSubtotal] = useState<number>(0)

  const getOrder = async () => {
    try {
      setLoading(true)
      const res = await getOrderById(`${params.id}`)
      setOrderData(res)
      setSubtotal((res as Order)?.items!.reduce((sum, item) => sum + item.total!, 0)!)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrder()
  }, [params])

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.completed:
        return "bg-green-100 text-green-800"
      case OrderStatus.processing:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.shipped:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.pending:
        return "bg-gray-100 text-gray-800"
      case OrderStatus.cancelled:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PaymentStatus.paid:
        return "bg-green-100 text-green-800"
      case PaymentStatus.pending:
        return "bg-yellow-100 text-yellow-800"
      case PaymentStatus.failed:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case OrderStatus.completed:
        return t("orders.status.completed")
      case OrderStatus.processing:
        return t("orders.status.processing")
      case OrderStatus.shipped:
        return t("orders.status.shipped")
      case OrderStatus.pending:
        return t("orders.status.pending")
      case OrderStatus.cancelled:
        return t("orders.status.cancelled")
      default:
        return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case PaymentStatus.paid:
        return t("orders.paymentStatus.paid")
      case PaymentStatus.pending:
        return t("orders.paymentStatus.pending")
      case PaymentStatus.failed:
        return t("orders.paymentStatus.failed")
      default:
        return status
    }
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case PaymentMethod.creditCard:
        return t("orders.paymentMethod.creditCard")
      case PaymentMethod.debitCard:
        return t("orders.paymentMethod.debitCard")
      case PaymentMethod.bankTransfer:
        return t("orders.paymentMethod.bankTransfer")
      case PaymentMethod.cash:
        return t("orders.paymentMethod.cash")
      case PaymentMethod.paypal:
        return t("orders.paymentMethod.paypal")
      default:
        return method
    }
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return;
    return `$${amount!.toLocaleString()}`
  }

  const getInitials = (name: string) => {
    if (!name) return "";

    return name
      .trim()
      .split(/\s+/)
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const handlePrint = () => {
    const printContent = printRef.current
    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${orderData?.id}</title>
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

  const handleSaveOrder = async (updateOrder: Partial<Order>) => {
    try {
      setLoading(true)
      const updateOrderData: Order = {
        id: updateOrder.id,
        createdAt: updateOrder.createdAt,
        updatedAt: new Date(),
        deliveryDate: new Date(),
        totalAmount: updateOrder.totalAmount || 0,
        status: updateOrder.status || OrderStatus.pending,
        paymentStatus: updateOrder.paymentStatus || PaymentStatus.pending,
        paymentMethod: updateOrder.paymentMethod || PaymentMethod.cash,
        items: updateOrder.items || [],
        customer: updateOrder.customer,
        shippingAddress: updateOrder.shippingAddress,
        notes: updateOrder.notes,
        tags: updateOrder.tags,
        shippingFee: updateOrder.shippingFee,
        tax: updateOrder.tax,
      }
      const updated = await apiUpdateOrder(orderData?.id!, updateOrderData)
      setSubtotal(updateOrderData?.items!.reduce((sum, item) => sum + item.total!, 0)!)
      setOrderData(updated)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if(!orderData) return;

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
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
                {t("orders.title")} {orderData?.id}
              </h2>
              <Badge className={getStatusColor(orderData?.status!)}>{getStatusText(orderData?.status!)}</Badge>
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
                  <Badge className={getStatusColor(orderData?.status!)}>{getStatusText(orderData?.status!)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.paymentStatus")}:</span>
                  <Badge className={getPaymentStatusColor(orderData?.paymentStatus!)}>
                    {getPaymentStatusText(orderData?.paymentStatus!)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.orderDate")}:</span>
                  <span className="text-sm font-medium">{formatDate(orderData?.deliveryDate!)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t("orders.expectedDelivery")}:</span>
                  {/* <span className="text-sm font-medium">{orderData.expectedDelivery}</span> */}
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
                  <AvatarImage src="/placeholder.svg" alt={orderData?.customer?.name} />
                  <AvatarFallback>{getInitials(orderData?.customer?.name!)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{orderData?.customer?.name}</p>
                  <p className="text-sm text-muted-foreground">{orderData?.customer?.company}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">{t("orders.modal.email")}: </span>
                  <span>{orderData?.customer?.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t("orders.modal.phone")}: </span>
                  <span>{orderData?.customer?.phone}</span>
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
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("orders.tax")}:</span>
                  <span>{formatCurrency(orderData?.tax!)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("orders.shipping")}:</span>
                  <span>{orderData?.shippingFee! === 0 ? t("orders.free") : formatCurrency(orderData?.shippingFee!)}</span>
                </div>
                {/* {orderData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("orders.discount")}:</span>
                    <span>-{formatCurrency(orderData.discount)}</span>
                  </div>
                )} */}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{t("orders.total")}:</span>
                  <span>{formatCurrency(orderData?.totalAmount!)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>{t("orders.orderItems")}</CardTitle>
            <CardDescription>{t("orders.includedProducts")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderData.items!.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-muted-foreground">SKU: {item.product?.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.quantity")}</p>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.unitPrice")}</p>
                    <p className="font-medium">{formatCurrency(item.unitPrice!)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{t("orders.total")}</p>
                    <p className="font-bold">{item.total}</p>
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
                  <p className="font-medium">{orderData?.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("orders.billingAddress")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{orderData?.shippingAddress}</p>
                </div>
              </CardContent>
            </Card>

            {orderData?.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("orders.orderNotes")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{orderData!.notes}</p>
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
            {/* <CardContent>
              <div className="space-y-4">
                {orderData!.timeline.map((step, index) => (
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
            </CardContent> */}
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
                <p className="font-medium">{getPaymentMethodText(orderData?.paymentMethod!)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.paymentStatus")}</p>
                <Badge className={getPaymentStatusColor(orderData?.paymentStatus!)}>
                  {getPaymentStatusText(orderData?.paymentStatus!)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("orders.totalAmount")}</p>
                <p className="font-bold text-lg">{orderData?.totalAmount!}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hidden Print Component */}
        <div className="hidden">
          <InvoicePrint ref={printRef} order={orderData!} />
        </div>

        {/* Edit Order Modal */}
        <EditOrderModal
          open={showEditModal}
          order={orderData!}
          onOpenChange={setShowEditModal}
          onSave={handleSaveOrder}
        />
      </div>
    </ERPLayout>
  )
}
