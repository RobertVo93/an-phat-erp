"use client"

import { OrderForm } from "@/components/orders/OrderForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { useNewOrder } from "@/hooks/use-new-order"
import { Order, Warehouse } from "@/types"
import { useEffect } from "react"

interface OrderNewModalProps {
  open: boolean
  allWarehouses: Warehouse[]
  onOpenChange: (open: boolean) => void
  createOrder: (orderData: Partial<Order>) => void
}

export function OrderNewModal({ open, allWarehouses, onOpenChange, createOrder }: OrderNewModalProps) {
  const { t } = useLanguage()
  const {  
    orderData,
    orderItems,
    subtotal,
    tax,
    shipping,
    total,
    setOrderData,
    setOrderItems,
    onCustomerselect,
    addProduct,
    updateProduct,
    removeItem,
    handleSubmit,
  } = useNewOrder(createOrder)

  useEffect(() => {
    if (allWarehouses.length > 0 && !orderData.warehouse) {
      setOrderData((currentOrder) => ({
        ...currentOrder,
        warehouse: allWarehouses.find((warehouse) => warehouse.main),
      }))
    }
  }, [allWarehouses, orderData.warehouse, setOrderData])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orders.createNewOrder")}</DialogTitle>
          <DialogDescription>{t("orders.fillOrderDetails")}</DialogDescription>
        </DialogHeader>
        <OrderForm
          orderData={orderData}
          orderItems={orderItems}
          allWarehouses={allWarehouses}
          subtotal={subtotal}
          tax={tax}
          shipping={shipping}
          total={total}
          submitLabel={t("orders.createOrder")}
          setOrderData={setOrderData}
          onCustomerSelect={onCustomerselect}
          onWarehouseSelect={(warehouse) => {
            setOrderData({ ...orderData, warehouse })
            setOrderItems([])
          }}
          addProduct={addProduct}
          updateProduct={updateProduct}
          removeItem={removeItem}
          onCancel={() => onOpenChange(false)}
          onSubmit={() => handleSubmit(onOpenChange)}
        />
      </DialogContent>
    </Dialog>
  )
}
