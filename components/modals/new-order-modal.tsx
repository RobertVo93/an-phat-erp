"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Search, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Customer } from "@/types/customer"
import { Product } from "@/types/product"
import { Order, OrderItem } from "@/types/order"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { formatLargeCurrency, formatLocalDatetime, groupWarehouseProductsByProduct } from "@/lib/utils"
import { Warehouse } from "@/types"

interface NewOrderModalProps {
  open: boolean
  customers: Customer[]
  allWarehouses: Warehouse[]
  onOpenChange: (open: boolean) => void
  createOrder: (orderData: Partial<Order>) => void
}

export function NewOrderModal({
  open,
  customers,
  allWarehouses,
  onOpenChange,
  createOrder
}: NewOrderModalProps) {
  const { t } = useLanguage()
  const [orderData, setOrderData] = useState<Order>({
    customer: undefined,
    deliveryDate: new Date(),
    totalAmount: 0,
    status: OrderStatus.pending,
    paymentStatus: PaymentStatus.pending,
    paymentMethod: PaymentMethod.cash,
    shippingAddress: "",
    items: [],
    notes: "",
    tags: [],
    warehouse: undefined
  })
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [showProductList, setShowProductList] = useState(false)
  const [showCustomerList, setShowCustomerList] = useState(false)
  const [warehouseProductTotal, setWarehouseProductTotal] = useState<number>(0)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(customerSearch?.toLowerCase()) ||
      customer.email?.toLowerCase().includes(customerSearch?.toLowerCase()) ||
      customer.company?.toLowerCase().includes(customerSearch?.toLowerCase()),
  )

  const selectCustomer = (customer: Customer) => {
    setOrderData({
      ...orderData,
      customer,
      shippingAddress: customer.location!,
    })
    setCustomerSearch(customer.name!)
    setShowCustomerList(false)
  }

  const addProduct = (product: Product) => {
    const newItem: OrderItem = {
      product,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
    }
    setOrderItems([...orderItems, newItem])
    setProductSearch("")
    setShowProductList(false)
  }

  const updateQuantity = (index: number, quantity: number, stock: number) => {
    if (quantity <= 0 || quantity > stock) return
    const updatedItems = [...orderItems]
    updatedItems[index].quantity = quantity
    updatedItems[index].total = quantity * updatedItems[index].unitPrice!
    setOrderItems(updatedItems)
  }

  const updatePrice = (index: number, price: number) => {
    if (price < 0) return
    const updatedItems = [...orderItems]
    updatedItems[index].unitPrice = price
    updatedItems[index].total = updatedItems[index].quantity! * price
    setOrderItems(updatedItems)
  }

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.total!, 0)
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
  const total = subtotal + tax + shipping

  const handleSubmit = () => {
    createOrder({
      ...orderData,
      items: orderItems,
      totalAmount: total,
      shippingFee: shipping,
      tax: tax
    })

    // Reset form and close modal
    setOrderData({
      customer: undefined,
      deliveryDate: new Date(),
      totalAmount: 0,
      status: OrderStatus.pending,
      paymentStatus: PaymentStatus.pending,
      paymentMethod: PaymentMethod.cash,
      shippingAddress: "",
      notes: "",
      items: [],
      tags: [],
      tax: 0,
      shippingFee: 0,
      warehouse: undefined
    })
    setOrderItems([])
    setCustomerSearch("")
    onOpenChange(false)
  }

  const getWarehouseProductTotal = (productId: string) => {
    return groupWarehouseProductsByProduct(orderData.warehouse?.warehouseProducts!)
      .find((wp) => (wp.product.id === productId))?.totalQuantity || 0
  }

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
              <div className="space-y-2">
                <Label htmlFor="customer">{t("orders.customer")} *</Label>
                <div className="relative">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder={t("orders.searchCustomers")}
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value)
                          setShowCustomerList(e.target.value.length > 0)
                        }}
                        className="pl-10"
                      />
                    </div>
                    <Button type="button" variant="outline" onClick={() => setShowCustomerList(!showCustomerList)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Customer Search Results */}
                  {showCustomerList && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                            onClick={() => selectCustomer(customer)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <p className="text-sm text-gray-500">{customer.company}</p>
                                <p className="text-xs text-gray-400">{customer.email}</p>
                              </div>
                              <Badge variant="outline">{customer.phone}</Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">{t("orders.noCustomersFound")}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {orderData.customer && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{orderData.customer.name}</p>
                      <p className="text-sm text-gray-500">{orderData.customer.company}</p>
                      <p className="text-xs text-gray-400">
                        {orderData.customer.email} • {orderData.customer.phone}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setOrderData({ ...orderData, customer: undefined, shippingAddress: "" })
                        setCustomerSearch("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">{t("orders.shippingAddress")} *</Label>
                <Textarea
                  id="shippingAddress"
                  value={orderData.shippingAddress}
                  onChange={(e) => setOrderData({ ...orderData, shippingAddress: e.target.value })}
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
                  onValueChange={(value: OrderStatus) => setOrderData({ ...orderData, status: value })}
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
                  onChange={(e) => setOrderData({ ...orderData, deliveryDate: new Date(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse">{t("orders.warehouse")} *</Label>
                <Select
                  value={orderData.warehouse?.id}
                  onValueChange={(value: string) => {
                    setOrderData({ ...orderData, warehouse: allWarehouses.find((wh) => wh.id === value) })
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
                  onChange={(e) => setOrderData({ ...orderData, tags: [...orderData.tags!, e.target.value] })}
                  placeholder={t("orders.tagsPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">{t("orders.paymentMethod")} *</Label>
                <Select
                  value={orderData.paymentMethod?.toString()}
                  onValueChange={(value: PaymentMethod) => setOrderData({ ...orderData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("orders.selectPaymentMethod")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.creditCard}>{t("orders.paymentMethod.creditCard")}</SelectItem>
                    <SelectItem value={PaymentMethod.debitCard}>{t("orders.paymentMethod.debitCard")}</SelectItem>
                    <SelectItem value={PaymentMethod.bankTransfer}>{t("orders.paymentMethod.bankTransfer")}</SelectItem>
                    <SelectItem value={PaymentMethod.cash}>{t("orders.paymentMethod.cash")}</SelectItem>
                    <SelectItem value={PaymentMethod.paypal}>{t("orders.paymentMethod.paypal")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{t("orders.orderNotes")}</Label>
                <Textarea
                  id="notes"
                  value={orderData.notes}
                  onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
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
            {/* Add Product */}
            <div className="space-y-4">
              <div className="relative">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={t("orders.searchProductsToAdd")}
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setShowProductList(e.target.value.length > 0)
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={() => setShowProductList(!showProductList)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Search Results */}
                {showProductList && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {orderData.warehouse?.warehouseProducts ? (
                      groupWarehouseProductsByProduct(orderData.warehouse?.warehouseProducts!)
                        .filter(product => !orderItems.some(item => item.product?.id === product.product.id))
                        .map((product, index) => (
                          <div
                            key={index}
                            className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${product.product.stock === 0 && 'pointer-events-none bg-gray-300'}`}
                            onClick={() => addProduct(product.product)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{product.product.name}</p>
                                <p className="text-sm text-gray-500">
                                  {formatLargeCurrency(product.product.price!, 2)} • {t("orders.modal.productStock")}: {product.totalQuantity}
                                </p>
                              </div>
                              <Badge variant="outline">{product.product.sku}</Badge>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">{t("orders.noProductsFound")}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Order Items List */}
              {orderItems.length > 0 && (
                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={item.product?.id} className="p-3 border rounded-lg space-y-3">
                      {/* Product Info */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.product!.name}</p>
                          <p className="text-xs text-gray-500">SKU: {item.product?.sku}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Controls Row */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Quantity Controls */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">{t("orders.quantity")}:</Label>
                          <div className="flex items-center space-x-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity! - 1, getWarehouseProductTotal(item.product?.id!))}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 1, getWarehouseProductTotal(item.product?.id!))}
                              className="h-8 w-20 text-center text-xs"
                              min="1"
                              max={getWarehouseProductTotal(item.product?.id!)}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity! + 1, getWarehouseProductTotal(item.product?.id!))}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* in stock */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">{t("orders.stock")}:</Label>
                          <Input
                            readOnly
                            value={getWarehouseProductTotal(item.product?.id!)}
                            className="h-8 text-xs bg-gray-300 pointer-events-none w-20"
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-500">{t("orders.price")}:</Label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updatePrice(index, Number.parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">{t("orders.total")}:</span>
                        <span className="text-sm font-bold">{formatLargeCurrency(item.total!, 2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {orderItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">{t("orders.noItemsAdded")}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("orders.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t("orders.subtotal")}:</span>
                  <span>{formatLargeCurrency(subtotal, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("orders.modal.taxRate")}:</span>
                  <span>{formatLargeCurrency(tax, 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("orders.shipping")}:</span>
                  <span>{formatLargeCurrency(shipping, 2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{t("orders.total")}:</span>
                  <span>{formatLargeCurrency(total, 2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !orderData.customer ||
              !orderData.shippingAddress ||
              !orderData.paymentMethod ||
              !orderData.status ||
              orderItems.length === 0 ||
              !orderData.warehouse
            }
          >
            {t("orders.createOrder")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
