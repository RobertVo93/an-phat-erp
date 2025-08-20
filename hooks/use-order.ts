import { useState, useRef, useEffect } from "react"
import { Order } from "@/types/order"
import { Customer, Warehouse } from "@/types"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { getOrderById, updateOrder as apiUpdateOrder } from "@/lib/httpclient/order.client"
import { getCustomers } from "@/lib/httpclient/customer.client"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"

export function useOrder(orderId: string) {
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
      const res = await Promise.all([getOrderById(orderId), getCustomers(), getWarehouses()])
      setOrderData(res[0])
      setSubtotal((res[0] as Order)?.items!.reduce((sum, item) => sum + item.total!, 0)!)
      setAllCustomers(res[1].data)
      setAllWarehouses(res[2].data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    }
  }, [orderId])

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
      const { updatedOrder } = await apiUpdateOrder(orderData?.id!, updateOrderData)
      setSubtotal(updateOrderData?.items!.reduce((sum, item) => sum + item.total!, 0)!)
      setOrderData(updatedOrder)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteOrder = async () => {
    try {
      setLoading(true)
      const { updatedOrder } = await apiUpdateOrder(orderId, {
        id: orderId,
        status: OrderStatus.completed,
      })
      setOrderData(updatedOrder)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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