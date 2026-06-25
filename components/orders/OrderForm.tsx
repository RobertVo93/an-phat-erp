"use client"

import { CustomerSelector, OrderItemSelector } from "@/components/common/selector"
import { OrderSummary } from "@/components/orders/OrderSummary"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/utils"
import { Customer, IOrderItem, Order, OrderStatus, PaymentMethod, Warehouse } from "@/types"
import type { Dispatch, SetStateAction } from "react"

type OrderItemField = "id" | "quantity" | "unitCost"

interface IOrderFormProps {
  orderData: Order
  orderItems: IOrderItem[]
  allWarehouses: Warehouse[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  submitLabel: string
  setOrderData: Dispatch<SetStateAction<Order>>
  onCustomerSelect: (customer: Customer | undefined) => void
  onWarehouseSelect: (warehouse: Warehouse | undefined) => void
  addProduct: () => void
  updateProduct: (index: number, field: OrderItemField, value: string | number) => void
  removeItem: (index: number) => void
  onCancel: () => void
  onSubmit: () => void
}

export function OrderForm({
  orderData,
  orderItems,
  allWarehouses,
  subtotal,
  tax,
  shipping,
  total,
  submitLabel,
  setOrderData,
  onCustomerSelect,
  onWarehouseSelect,
  addProduct,
  updateProduct,
  removeItem,
  onCancel,
  onSubmit,
}: IOrderFormProps) {
  const { t } = useLanguage()
  const isSubmitDisabled = !orderData.customer ||
    !orderData.status ||
    !orderData.paymentMethod ||
    orderItems.length === 0 ||
    !orderData.warehouse

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("orders.customerInformation")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CustomerSelector
              onCustomerSelect={onCustomerSelect}
              selectedCustomer={orderData.customer}
            />
            <div className="space-y-2">
              <Label htmlFor="shippingAddress">{t("orders.shippingAddress")}</Label>
              <Textarea
                id="shippingAddress"
                value={orderData.shippingAddress ?? ""}
                onChange={(event) => setOrderData({ ...orderData, shippingAddress: event.target.value })}
                placeholder={t("orders.enterShippingAddress")}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("orders.orderDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t("orders.status")} *</Label>
              <Select
                value={orderData.status}
                onValueChange={(value) => setOrderData({ ...orderData, status: value as OrderStatus })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={t("orders.selectOrderStatus")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(OrderStatus).map((status) => (
                    <SelectItem value={status} key={status}>
                      {t(`orders.status.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("orders.deliveryDateTime")}</Label>
              <Calendar
                selected={orderData.deliveryDate ? new Date(orderData.deliveryDate) : null}
                onChange={(value) => setOrderData({ ...orderData, deliveryDate: value || undefined })}
                showTimeSelect
                timeIntervals={15}
                timeFormat="HH:mm"
                dateFormat="dd/MM/yyyy HH:mm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouse">{t("orders.warehouse")} *</Label>
              <Select
                value={orderData.warehouse?.id}
                onValueChange={(value) => onWarehouseSelect(allWarehouses.find((warehouse) => warehouse.id === value))}
              >
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder={t("orders.selectWarehouse")} />
                </SelectTrigger>
                <SelectContent>
                  {allWarehouses.map((warehouse) => (
                    <SelectItem value={warehouse.id!} key={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">{t("orders.tags")}</Label>
              <Input
                id="tags"
                value={orderData.tags?.join(", ") ?? ""}
                onChange={(event) => {
                  const tags = event.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                  setOrderData({ ...orderData, tags })
                }}
                placeholder={t("orders.tagsPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">{t("orders.paymentMethod")} *</Label>
              <Select
                value={orderData.paymentMethod}
                onValueChange={(value) => setOrderData({ ...orderData, paymentMethod: value as PaymentMethod })}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder={t("orders.selectPaymentMethod")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((paymentMethod) => (
                    <SelectItem value={paymentMethod} key={paymentMethod}>
                      {t(`orders.paymentMethod.${paymentMethod}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("orders.orderNotes")}</Label>
              <Textarea
                id="notes"
                value={orderData.notes ?? ""}
                onChange={(event) => setOrderData({ ...orderData, notes: event.target.value })}
                placeholder={t("orders.specialInstructions")}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <OrderItemSelector
            selectedItems={orderItems}
            addItem={addProduct}
            updateItem={updateProduct}
            removeItem={removeItem}
            selectedWarehouse={orderData.warehouse}
          />
          {orderItems.length === 0 && (
            <div className="py-8 text-center text-gray-500">{t("orders.noItemsAdded")}</div>
          )}
        </CardContent>
      </Card>

      {orderItems.length > 0 && (
        <OrderSummary
          subtotal={formatCurrency(subtotal)}
          tax={formatCurrency(tax)}
          shipping={formatCurrency(shipping)}
          total={formatCurrency(total)}
        />
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitDisabled}>
          {submitLabel}
        </Button>
      </div>
    </>
  )
}
