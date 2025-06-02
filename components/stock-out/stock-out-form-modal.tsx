"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Package } from "lucide-react"
import type { StockOut, StockOutProduct } from "@/types/stock-out"
import { useLanguage } from "@/contexts/language-context"

interface StockOutFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (stockOut: Omit<StockOut, "id" | "receiptNumber" | "createdAt" | "updatedAt">) => void
  stockOut?: StockOut
  mode: "create" | "edit"
}

// Mock data for products with stock levels
const mockProducts = [
  { id: "1", name: "Laptop Dell XPS 13", sku: "DELL-XPS13-001", price: 25000000, stock: 15 },
  { id: "2", name: "Chuột không dây Logitech", sku: "LOG-MOUSE-001", price: 500000, stock: 50 },
  { id: "3", name: "iPhone 15 Pro", sku: "APPLE-IP15P-001", price: 30000000, stock: 8 },
  { id: "4", name: "Máy in Canon LBP", sku: "CANON-LBP-001", price: 3500000, stock: 12 },
  { id: "5", name: "Bàn phím cơ Gaming", sku: "GAMING-KB-001", price: 1500000, stock: 25 },
]

const mockCustomers = [
  {
    id: "1",
    name: "Công ty TNHH Công nghệ ABC",
    phone: "0901234567",
    address: "123 Đường Nguyễn Văn Linh, Q.7, TP.HCM",
  },
  { id: "2", name: "Cửa hàng Điện tử XYZ", phone: "0987654321", address: "456 Đường Lê Văn Việt, Q.9, TP.HCM" },
  { id: "3", name: "Siêu thị Điện máy DEF", phone: "0912345678", address: "789 Đường Võ Văn Tần, Q.3, TP.HCM" },
]

const mockWarehouses = [
  { id: "1", name: "Kho Chính" },
  { id: "2", name: "Kho Phụ" },
  { id: "3", name: "Kho Chi Nhánh" },
]

const shippingMethods = ["Giao hàng tiêu chuẩn", "Giao hàng nhanh", "Giao hàng hỏa tốc", "Tự đến lấy"]

export function StockOutFormModal({ isOpen, onClose, onSubmit, stockOut, mode }: StockOutFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    warehouseId: "",
    warehouseName: "",
    orderReference: "",
    trackingNumber: "",
    shippingMethod: "Giao hàng tiêu chuẩn",
    notes: "",
    processedBy: "",
    status: "draft" as const,
    products: [] as StockOutProduct[],
    discount: 0,
    discountType: "fixed" as const,
  })

  useEffect(() => {
    if (stockOut && mode === "edit") {
      setFormData({
        date: stockOut.date,
        customerId: stockOut.customerId,
        customerName: stockOut.customerName,
        customerPhone: stockOut.customerPhone,
        customerAddress: stockOut.customerAddress,
        warehouseId: stockOut.warehouseId,
        warehouseName: stockOut.warehouseName,
        orderReference: stockOut.orderReference || "",
        trackingNumber: stockOut.trackingNumber || "",
        shippingMethod: stockOut.shippingMethod,
        notes: stockOut.notes,
        processedBy: stockOut.processedBy,
        status: stockOut.status,
        products: stockOut.products,
        discount: stockOut.discount,
        discountType: stockOut.discountType,
      })
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        warehouseId: "",
        warehouseName: "",
        orderReference: "",
        trackingNumber: "",
        shippingMethod: "Giao hàng tiêu chuẩn",
        notes: "",
        processedBy: "",
        status: "draft",
        products: [],
        discount: 0,
        discountType: "fixed",
      })
    }
  }, [stockOut, mode, isOpen])

  const handleCustomerChange = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId)
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
      }))
    }
  }

  const handleWarehouseChange = (warehouseId: string) => {
    const warehouse = mockWarehouses.find((w) => w.id === warehouseId)
    if (warehouse) {
      setFormData((prev) => ({
        ...prev,
        warehouseId,
        warehouseName: warehouse.name,
      }))
    }
  }

  const addProduct = () => {
    const newProduct: StockOutProduct = {
      id: Date.now().toString(),
      productId: "",
      productName: "",
      sku: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      availableStock: 0,
    }
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
  }

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  const updateProduct = (index: number, field: keyof StockOutProduct, value: any) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) => {
        if (i === index) {
          const updatedProduct = { ...product, [field]: value }

          if (field === "productId") {
            const selectedProduct = mockProducts.find((p) => p.id === value)
            if (selectedProduct) {
              updatedProduct.productName = selectedProduct.name
              updatedProduct.sku = selectedProduct.sku
              updatedProduct.unitPrice = selectedProduct.price
              updatedProduct.availableStock = selectedProduct.stock
            }
          }

          if (field === "quantity" || field === "unitPrice") {
            updatedProduct.totalPrice = updatedProduct.quantity * updatedProduct.unitPrice
          }

          return updatedProduct
        }
        return product
      }),
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.products.reduce((sum, product) => sum + product.totalPrice, 0)
    const discountAmount =
      formData.discountType === "percentage" ? (subtotal * formData.discount) / 100 : formData.discount
    const afterDiscount = subtotal - discountAmount
    const tax = afterDiscount * 0.1 // 10% VAT
    const totalAmount = afterDiscount + tax

    return { subtotal, discountAmount, tax, totalAmount }
  }

  const { subtotal, discountAmount, tax, totalAmount } = calculateTotals()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const stockOutData = {
      ...formData,
      subtotal,
      tax,
      totalAmount,
    }

    onSubmit(stockOutData)
    onClose()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("stockOut.newStockOut") : t("stockOut.editStockOut")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">{t("common.date")}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">{t("common.status")}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t("stockOut.status.draft")}</SelectItem>
                      <SelectItem value="processing">{t("stockOut.status.processing")}</SelectItem>
                      <SelectItem value="shipped">{t("stockOut.status.shipped")}</SelectItem>
                      <SelectItem value="delivered">{t("stockOut.status.delivered")}</SelectItem>
                      <SelectItem value="cancelled">{t("stockOut.status.cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("stockOut.customer")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer">{t("stockOut.customer")}</Label>
                <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("stockOut.customer")} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerPhone">{t("stockOut.customerPhone")}</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">{t("stockOut.customerAddress")}</Label>
                  <Input
                    id="customerAddress"
                    value={formData.customerAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerAddress: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse & Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("stockOut.warehouse")} & {t("common.shipping")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="warehouse">{t("stockOut.warehouse")}</Label>
                  <Select value={formData.warehouseId} onValueChange={handleWarehouseChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("stockOut.warehouse")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shippingMethod">{t("stockOut.shippingMethod")}</Label>
                  <Select
                    value={formData.shippingMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, shippingMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="orderReference">{t("stockOut.orderReference")}</Label>
                  <Input
                    id="orderReference"
                    value={formData.orderReference}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orderReference: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="trackingNumber">{t("stockOut.trackingNumber")}</Label>
                  <Input
                    id="trackingNumber"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, trackingNumber: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t("stockOut.products")}</CardTitle>
              <Button type="button" onClick={addProduct} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t("stockOut.addProduct")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.products.map((product, index) => (
                <div key={product.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">
                        {t("common.product")} {index + 1}
                      </span>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeProduct(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <Label>{t("common.product")}</Label>
                      <Select
                        value={product.productId}
                        onValueChange={(value) => updateProduct(index, "productId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("stockOut.selectProduct")} />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <div className="flex flex-col">
                                <span>{p.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {p.sku} - {t("stockOut.availableStock")}: {p.stock}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>{t("common.quantity")}</Label>
                      <Input
                        type="number"
                        min="1"
                        max={product.availableStock}
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, "quantity", Number.parseInt(e.target.value) || 0)}
                      />
                      {product.quantity > product.availableStock && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          {t("stockOut.insufficientStock")}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <Label>{t("common.unitPrice")}</Label>
                      <Input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => updateProduct(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {t("stockOut.availableStock")}: {product.availableStock}
                    </span>
                    <span className="font-medium">
                      {t("common.total")}: {formatCurrency(product.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.pricing")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="discount">{t("common.discount")}</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, discount: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="discountType">{t("common.discountType")}</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, discountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">{t("common.fixed")}</SelectItem>
                      <SelectItem value="percentage">{t("common.percentage")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>{t("common.subtotal")}:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("common.discount")}:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("common.tax")} (10%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{t("common.total")}:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("common.additionalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="processedBy">{t("stockOut.processedBy")}</Label>
                <Input
                  id="processedBy"
                  value={formData.processedBy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, processedBy: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notes">{t("common.notes")}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{mode === "create" ? t("common.create") : t("common.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
