"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Customer } from "@/types/customer"
import { Order } from "@/types/order"
import { OrderStatus, PaymentMethod } from "@/types/enums"
import { Warehouse } from "@/types"
import { formatLargeCurrency, formatLocalDatetime } from "@/lib/utils"
import { CustomerSelector } from "@/components/orders/CustomerSelector"
import { ProductSelector } from "@/components/orders/ProductSelector"
import { OrderItemsList } from "@/components/orders/OrderItemsList"
import { OrderSummary } from "@/components/orders/OrderSummary"
import { useEditOrder } from "@/hooks/use-edit-order"

interface OrderEditModalProps {
  order: Order
  open: boolean
  customers: Customer[]
  allWarehouses: Warehouse[]
  onOpenChange: (open: boolean) => void
  onUpdate: (orderData: Partial<Order>) => void
}

export function OrderEditModal({ order, open, customers, allWarehouses, onOpenChange, onUpdate }: OrderEditModalProps) {
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
    updateQuantity,
    updatePrice,
    removeItem,
    handleSubmit,
    getWarehouseProductTotal,
  } = useEditOrder(order, onUpdate)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("orders.createNewOrder")}</DialogTitle>
          <DialogDescription>{t("orders.fillOrderDetails")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.customerInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomerSelector
                customers={customers}
                onCustomerSelect={onCustomerselect}
                selectedCustomer={orderData.customer}
              />
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">{t("orders.shippingAddress")}</Label>
                <Textarea
                  id="shippingAddress"
                  value={orderData.shippingAddress}
                  onChange={e => setOrderData({ ...orderData, shippingAddress: e.target.value })}
                  placeholder={t("orders.enterShippingAddress")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.orderDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">{t("orders.status")} *</Label>
                <Select
                  value={orderData.status?.toString()}
                  onValueChange={value => setOrderData({ ...orderData, status: value as OrderStatus })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("orders.selectOrderStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(OrderStatus).map((status, index) => (
                      <SelectItem value={status} key={index}>{t(`orders.status.${status}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDateTime">{t("orders.deliveryDateTime")}</Label>
                <Input
                  id="deliveryDateTime"
                  type="datetime-local"
                  value={orderData.deliveryDate ? formatLocalDatetime(orderData.deliveryDate) : ""}
                  onChange={e => setOrderData({ ...orderData, deliveryDate: new Date(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">{t("orders.warehouse")} *</Label>
                <Select
                  value={orderData.warehouse?.id}
                  onValueChange={value => {
                    setOrderData({ ...orderData, warehouse: allWarehouses.find(wh => wh.id === value) })
                    setOrderItems([])
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("orders.selectWarehouse")} />
                  </SelectTrigger>
                  <SelectContent>
                    {allWarehouses.map((wh, ind) => (
                      <SelectItem value={wh.id!} key={ind}>{wh.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">{t("orders.tags")}</Label>
                <Input
                  id="tags"
                  value={orderData.tags}
                  onChange={e => setOrderData({ ...orderData, tags: [...orderData.tags!, e.target.value] })}
                  placeholder={t("orders.tagsPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">{t("orders.paymentMethod")} *</Label>
                <Select
                  value={orderData.paymentMethod?.toString()}
                  onValueChange={value => setOrderData({ ...orderData, paymentMethod: value as PaymentMethod })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("orders.selectPaymentMethod")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PaymentMethod).map((paymentMethod, index) => (
                      <SelectItem value={paymentMethod} key={index}>{t(`orders.paymentMethod.${paymentMethod}`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">{t("orders.orderNotes")}</Label>
                <Textarea
                  id="notes"
                  value={orderData.notes}
                  onChange={e => setOrderData({ ...orderData, notes: e.target.value })}
                  placeholder={t("orders.specialInstructions")}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Products Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("orders.orderItems")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductSelector
              orderItems={orderItems}
              products={orderData.warehouse?.warehouseProducts || []}
              addProduct={addProduct}
            />
            {orderItems.length > 0 ? (
              <OrderItemsList
                orderItems={orderItems}
                updateQuantity={updateQuantity}
                updatePrice={updatePrice}
                removeItem={removeItem}
                getWarehouseProductTotal={getWarehouseProductTotal}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">{t("orders.noItemsAdded")}</div>
            )}
          </CardContent>
        </Card>
        {/* Order Summary */}
        {orderItems.length > 0 && (
          <OrderSummary
            subtotal={formatLargeCurrency(subtotal, 2)}
            tax={formatLargeCurrency(tax, 2)}
            shipping={formatLargeCurrency(shipping, 2)}
            total={formatLargeCurrency(total, 2)}
          />
        )}
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={() => handleSubmit(onOpenChange)}
            disabled={
              !orderData.customer ||
              !orderData.status ||
              !orderData.paymentMethod ||
              orderItems.length === 0 ||
              !orderData.warehouse
            }
          >
            {t("orders.saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
