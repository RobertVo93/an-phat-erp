"use client"

import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { InvoicePrint } from "@/components/invoice-print"
import { OrderActivityLog } from "@/components/orders/OrderActivityLog"
import { OrderCustomerInfo } from "@/components/orders/OrderCustomerInfo"
import { OrderDetailHeader } from "@/components/orders/OrderDetailHeader"
import { OrderItemsListDetail } from "@/components/orders/OrderItemsListDetail"
import { OrderStatusSummary } from "@/components/orders/OrderStatusSummary"
import { OrderSummaryCard } from "@/components/orders/OrderSummaryCard"
import { OrderTimeline } from "@/components/orders/OrderTimeline"
import { OrderEditModal } from "@/components/orders/modals/OrderEditModal"
import { useLanguage } from "@/contexts/language-context"
import { useOrder } from "@/hooks/use-order"
import type { IOrderDetailPageData } from "@/lib/services/orderDetailPageService"
import { OrderStatus, PaymentStatus } from "@/types"

interface IOrderDetailClientProps {
  orderId: string
  initialData: IOrderDetailPageData
}

export function OrderDetailClient({ orderId, initialData }: IOrderDetailClientProps) {
  const { t } = useLanguage()
  const {
    allCustomers,
    allWarehouses,
    showEditModal,
    orderData,
    printRef,
    loading,
    subtotal,
    orderActivityLogs,
    setShowEditModal,
    handlePrint,
    handleSaveOrder,
    handleCompleteOrder,
  } = useOrder(orderId, initialData)

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

  if (!orderData) return null

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <OrderDetailHeader
          orderData={orderData}
          setShowEditModal={setShowEditModal}
          handlePrint={handlePrint}
          handleCompleteOrder={handleCompleteOrder}
          getStatusText={getStatusText}
        />
        <div className="grid gap-6 md:grid-cols-3">
          <OrderStatusSummary
            orderData={orderData}
            getStatusText={getStatusText}
            getPaymentStatusText={getPaymentStatusText}
          />
          <OrderCustomerInfo orderData={orderData} />
          <OrderSummaryCard
            subtotal={subtotal}
            orderData={orderData}
          />
        </div>
        <OrderItemsListDetail orderData={orderData} />
        <OrderTimeline />

        <OrderActivityLog activityLogs={orderActivityLogs} />

        <div className="hidden">
          <InvoicePrint ref={printRef} order={orderData} />
        </div>

        <OrderEditModal
          order={orderData}
          open={showEditModal}
          customers={allCustomers}
          allWarehouses={allWarehouses}
          onOpenChange={setShowEditModal}
          onUpdate={handleSaveOrder}
        />
      </div>
    </>
  )
}
