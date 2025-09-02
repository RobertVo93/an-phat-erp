import { useState, useRef, useEffect } from "react"
import { Order } from "@/types/order"
import { Customer, Warehouse } from "@/types"
import { CustomerStatus, OrderStatus, PaymentMethod, PaymentStatus, WarehouseStatus } from "@/types/enums"
import { getOrderById, updateOrder as apiUpdateOrder } from "@/lib/httpclient/order.client"
import { getCustomers } from "@/lib/httpclient/customer.client"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function useOrder(orderId: string) {
  const { t } = useLanguage()
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [orderData, setOrderData] = useState<Order>()
  const [loading, setLoading] = useState<boolean>(false)
  const [subtotal, setSubtotal] = useState<number>(0)
  const printRef = useRef<HTMLDivElement>(null)

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true)
      const res = await getOrderById(orderId)
      setOrderData(res)
      setSubtotal((res as Order)?.items!.reduce((sum, item) => sum + item.totalCost!, 0)!)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
        deliveryDate: updateOrder.deliveryDate,
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
        warehouse: updateOrder.warehouse,
      }
      await apiUpdateOrder(orderData?.id!, updateOrderData)
      await fetchOrder(orderId)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotUpdate"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteOrder = async () => {
    try {
      setLoading(true)
      await apiUpdateOrder(orderId, {
        id: orderId,
        status: OrderStatus.completed,
      })
      await fetchOrder(orderId)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotUpdate"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [orderId])

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true)
        const res = await Promise.all([
          getCustomers({status: CustomerStatus.active}), 
          getWarehouses({status: WarehouseStatus.active})
        ])
        setAllCustomers(res[0].data)
        setAllWarehouses(res[1].data)
      } catch (e) {
        console.error(e)
        toast({
          title: t("common.error.title"),
          description: t("common.error.cannotLoad"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    initialize()
  }, [])

  return {
    allCustomers,
    allWarehouses,
    showEditModal,
    orderData,
    printRef,
    loading,
    subtotal,
    setShowEditModal,
    handlePrint,
    handleSaveOrder,
    handleCompleteOrder,
  }
}