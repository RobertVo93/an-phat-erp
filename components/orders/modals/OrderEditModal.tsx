"use client"

import { OrderForm } from "@/components/orders/OrderForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { useEditOrder } from "@/hooks/use-edit-order"
import { Customer, Order, Warehouse } from "@/types"

interface OrderEditModalProps {
  order: Order
  open: boolean
  customers: Customer[]
  allWarehouses: Warehouse[]
  onOpenChange: (open: boolean) => void
  onUpdate: (orderData: Partial<Order>) => void
}

export function OrderEditModal({
  order,
  open,
  allWarehouses,
  onOpenChange,
  onUpdate,
}: OrderEditModalProps) {
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
  } = useEditOrder(order, onUpdate)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orders.editOrder")}</DialogTitle>
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
          submitLabel={t("orders.saveChanges")}
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
