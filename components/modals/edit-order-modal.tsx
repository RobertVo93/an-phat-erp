"use client"

import { useState, useEffect } from "react"
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

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
}

interface OrderItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  unitPrice: number
  total: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
}

interface EditOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: any // The order data passed from the parent
  onSave: (updatedOrder: any) => void
}

export function EditOrderModal({ open, onOpenChange, order, onSave }: EditOrderModalProps) {
  const { t } = useLanguage()
  const [orderData, setOrderData] = useState({
    customer: null as Customer | null,
    tags: "",
    deliveryDateTime: "",
    status: "Pending",
    shippingAddress: "",
    billingAddress: "",
    paymentMethod: "",
    paymentStatus: "Pending",
    notes: "",
  })
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [customerSearch, setCustomerSearch] = useState("")
  const [showProductList, setShowProductList] = useState(false)
  const [showCustomerList, setShowCustomerList] = useState(false)

  // Sample products
  const products: Product[] = [
    { id: "PRD-001", name: "Laptop Dell XPS 13", price: 1299, stock: 25, category: t("products.category.electronics") },
    { id: "PRD-002", name: "iPhone 15 Pro", price: 1499, stock: 15, category: t("products.category.electronics") },
    { id: "PRD-003", name: "Ghế văn phòng", price: 399, stock: 8, category: t("products.category.furniture") },
    { id: "PRD-004", name: "Chuột không dây", price: 35, stock: 50, category: t("products.category.accessories") },
    { id: "PRD-005", name: "Đèn bàn", price: 65, stock: 20, category: t("products.category.furniture") },
    { id: "PRD-006", name: "Ốp điện thoại", price: 25, stock: 100, category: t("products.category.accessories") },
  ]

  // Sample customers
  const customers: Customer[] = [
    {
      id: "CUST-001",
      name: "Nguyễn Văn An",
      email: "nguyen.van.an@email.com",
      phone: "+84 123 456 789",
      company: "Công ty An Phát",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM, Việt Nam",
    },
    {
      id: "CUST-002",
      name: "Trần Thị Bình",
      email: "tran.thi.binh@email.com",
      phone: "+84 987 654 321",
      company: "Studio Thiết Kế Bình",
      address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM, Việt Nam",
    },
    {
      id: "CUST-003",
      name: "Lê Minh Cường",
      email: "le.minh.cuong@email.com",
      phone: "+84 555 123 456",
      company: "Thương Mại Cường Thịnh",
      address: "789 Đường Trần Hưng Đạo, Quận 5, TP.HCM, Việt Nam",
    },
  ]

  // Initialize form with order data when modal opens
  useEffect(() => {
    if (open && order) {
      // Find customer from the order
      const customer = customers.find((c) => c.name === order.customer.name) || {
        id: "CUST-TEMP",
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        company: order.customer.company,
        address: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`,
      }

      setOrderData({
        customer,
        tags: order.tags || "",
        deliveryDateTime: order.expectedDelivery ? `${order.expectedDelivery}T12:00` : "",
        status: order.status,
        shippingAddress: customer.address,
        billingAddress: `${order.billingAddress.street}, ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zipCode}, ${order.billingAddress.country}`,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes || "",
      })

      setCustomerSearch(customer.name)
      setOrderItems(order.items)
    }
  }, [open, order])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.company.toLowerCase().includes(customerSearch.toLowerCase()),
  )

  const selectCustomer = (customer: Customer) => {
    setOrderData({
      ...orderData,
      customer,
      shippingAddress: customer.address,
    })
    setCustomerSearch(customer.name)
    setShowCustomerList(false)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !orderItems.some((item) => item.name === product.name),
  )

  const addProduct = (product: Product) => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      name: product.name,
      sku: `${product.id}-SKU`,
      category: product.category,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
    }
    setOrderItems([...orderItems, newItem])
    setProductSearch("")
    setShowProductList(false)
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) return
    const updatedItems = [...orderItems]
    updatedItems[index].quantity = quantity
    updatedItems[index].total = quantity * updatedItems[index].unitPrice
    setOrderItems(updatedItems)
  }

  const updatePrice = (index: number, price: number) => {
    if (price < 0) return
    const updatedItems = [...orderItems]
    updatedItems[index].unitPrice = price
    updatedItems[index].total = updatedItems[index].quantity * price
    setOrderItems(updatedItems)
  }

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 100 ? 0 : 15 // Free shipping over $100
  const total = subtotal + tax + shipping

  const handleSubmit = () => {
    const updatedOrder = {
      ...order,
      customer: orderData.customer,
      status: orderData.status,
      paymentStatus: orderData.paymentStatus,
      paymentMethod: orderData.paymentMethod,
      expectedDelivery: orderData.deliveryDateTime ? orderData.deliveryDateTime.split("T")[0] : order.expectedDelivery,
      tags: orderData.tags,
      notes: orderData.notes,
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: {
        ...order.shippingAddress,
        street: orderData.shippingAddress.split(",")[0] || order.shippingAddress.street,
      },
      billingAddress: {
        ...order.billingAddress,
        street: orderData.billingAddress.split(",")[0] || order.billingAddress.street,
      },
    }

    onSave(updatedOrder)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("orders.editOrderTitle")} {order?.orderNumber}
          </DialogTitle>
          <DialogDescription>{t("orders.updateOrderDetails")}</DialogDescription>
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
                        setOrderData({ ...orderData, customer: null, shippingAddress: "" })
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

              <div className="space-y-2">
                <Label htmlFor="billingAddress">{t("orders.billingAddress")}</Label>
                <Textarea
                  id="billingAddress"
                  value={orderData.billingAddress}
                  onChange={(e) => setOrderData({ ...orderData, billingAddress: e.target.value })}
                  placeholder={t("orders.enterBillingAddress")}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">{t("orders.status")} *</Label>
                  <Select
                    value={orderData.status}
                    onValueChange={(value) => setOrderData({ ...orderData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("orders.selectOrderStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">{t("orders.status.pending")}</SelectItem>
                      <SelectItem value="Processing">{t("orders.status.processing")}</SelectItem>
                      <SelectItem value="Shipped">{t("orders.status.shipped")}</SelectItem>
                      <SelectItem value="Delivered">{t("orders.status.delivered")}</SelectItem>
                      <SelectItem value="Cancelled">{t("orders.status.cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">{t("orders.paymentStatus")}</Label>
                  <Select
                    value={orderData.paymentStatus}
                    onValueChange={(value) => setOrderData({ ...orderData, paymentStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("orders.selectPaymentStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">{t("orders.paymentStatus.pending")}</SelectItem>
                      <SelectItem value="Paid">{t("orders.paymentStatus.paid")}</SelectItem>
                      <SelectItem value="Partial">{t("orders.paymentStatus.partial")}</SelectItem>
                      <SelectItem value="Failed">{t("orders.paymentStatus.failed")}</SelectItem>
                      <SelectItem value="Refunded">{t("orders.paymentStatus.refunded")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryDateTime">{t("orders.deliveryDateTime")}</Label>
                <Input
                  id="deliveryDateTime"
                  type="datetime-local"
                  value={orderData.deliveryDateTime}
                  onChange={(e) => setOrderData({ ...orderData, deliveryDateTime: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">{t("orders.tags")}</Label>
                <Input
                  id="tags"
                  value={orderData.tags}
                  onChange={(e) => setOrderData({ ...orderData, tags: e.target.value })}
                  placeholder={t("orders.tagsPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">{t("orders.paymentMethod")} *</Label>
                <Select
                  value={orderData.paymentMethod}
                  onValueChange={(value) => setOrderData({ ...orderData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("orders.selectPaymentMethod")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">{t("orders.paymentMethod.creditCard")}</SelectItem>
                    <SelectItem value="Debit Card">{t("orders.paymentMethod.debitCard")}</SelectItem>
                    <SelectItem value="Bank Transfer">{t("orders.paymentMethod.bankTransfer")}</SelectItem>
                    <SelectItem value="Cash">{t("orders.paymentMethod.cash")}</SelectItem>
                    <SelectItem value="PayPal">{t("orders.paymentMethod.paypal")}</SelectItem>
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
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => addProduct(product)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                ${product.price} • {t("orders.modal.productStock")}: {product.stock}
                              </p>
                            </div>
                            <Badge variant="outline">{product.category}</Badge>
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
                    <div key={item.id} className="border rounded-lg p-3 space-y-3">
                      {/* Product Info Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 ml-2 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Controls Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Quantity Controls */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">{t("orders.quantity")}</Label>
                          <div className="flex items-center space-x-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(index, Number.parseInt(e.target.value) || 1)}
                              className="h-8 text-center text-sm"
                              min="1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Price Controls */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">{t("orders.unitPrice")}</Label>
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updatePrice(index, Number.parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{t("orders.total")}:</span>
                          <span className="font-medium">${item.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {orderItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">{t("orders.noItemsInOrder")}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <div className="pt-4 border-t">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("orders.subtotal")}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("orders.modal.taxRate")}:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("orders.shipping")}:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>{t("orders.total")}:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

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
              orderItems.length === 0
            }
          >
            {t("orders.saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
