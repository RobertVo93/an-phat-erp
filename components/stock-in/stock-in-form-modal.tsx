"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Package } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import type { StockIn, StockInItem } from "@/types/stock-in"

interface StockInFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (stockIn: Omit<StockIn, "id" | "createdAt" | "updatedAt">) => void
  stockIn?: StockIn
}

// Mock data for suppliers, warehouses, and products
const mockSuppliers = [
  { id: "sup1", name: "Tech Supplies Co." },
  { id: "sup2", name: "Office Solutions Ltd." },
  { id: "sup3", name: "Electronics Hub" },
  { id: "sup4", name: "Home & Garden Co." },
]

const mockWarehouses = [
  { id: "wh1", name: "Kho Chính" },
  { id: "wh2", name: "Kho Chi Nhánh Bắc" },
  { id: "wh3", name: "Kho Dự Phòng" },
]

const mockProducts = [
  { id: "p1", name: "Laptop Dell XPS 13", sku: "DELL-XPS13", price: 25000000 },
  { id: "p2", name: "Chuột Không Dây", sku: "MOUSE-WL", price: 500000 },
  { id: "p3", name: "Ghế Văn Phòng", sku: "CHAIR-OFF", price: 3000000 },
  { id: "p4", name: "Đèn Bàn LED", sku: "LAMP-LED", price: 800000 },
  { id: "p5", name: "iPhone 15 Pro", sku: "IP15-PRO", price: 30000000 },
  { id: "p6", name: "Bộ Dụng Cụ Làm Vườn", sku: "GARDEN-SET", price: 2500000 },
]

export function StockInFormModal({ isOpen, onClose, onSave, stockIn }: StockInFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    receiptNumber: "",
    date: new Date().toISOString().split("T")[0],
    supplierId: "",
    supplierName: "",
    warehouseId: "",
    warehouseName: "",
    items: [] as StockInItem[],
    subtotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    status: "draft" as const,
    notes: "",
    referenceNumber: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (stockIn) {
      setFormData({
        receiptNumber: stockIn.receiptNumber,
        date: stockIn.date,
        supplierId: stockIn.supplierId,
        supplierName: stockIn.supplierName,
        warehouseId: stockIn.warehouseId,
        warehouseName: stockIn.warehouseName,
        items: stockIn.items,
        subtotal: stockIn.subtotal,
        tax: stockIn.tax,
        discount: stockIn.discount,
        totalAmount: stockIn.totalAmount,
        status: stockIn.status,
        notes: stockIn.notes || "",
        referenceNumber: stockIn.referenceNumber || "",
      })
    } else {
      // Generate new receipt number
      const receiptNumber = `SI-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      setFormData((prev) => ({ ...prev, receiptNumber }))
    }
  }, [stockIn])

  const calculateTotals = (items: StockInItem[], tax: number, discount: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0)
    const taxAmount = (subtotal * tax) / 100
    const totalAmount = subtotal + taxAmount - discount
    return { subtotal, taxAmount, totalAmount }
  }

  const addProduct = () => {
    const newItem: StockInItem = {
      productId: "",
      productName: "",
      productSku: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
    }
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }))
  }

  const updateItem = (index: number, field: keyof StockInItem, value: any) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "productId") {
      const product = mockProducts.find((p) => p.id === value)
      if (product) {
        updatedItems[index].productName = product.name
        updatedItems[index].productSku = product.sku
        updatedItems[index].unitCost = product.price
      }
    }

    if (field === "quantity" || field === "unitCost") {
      updatedItems[index].totalCost = updatedItems[index].quantity * updatedItems[index].unitCost
    }

    const { subtotal, taxAmount, totalAmount } = calculateTotals(updatedItems, formData.tax, formData.discount)
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax: taxAmount,
      totalAmount,
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index)
    const { subtotal, taxAmount, totalAmount } = calculateTotals(updatedItems, formData.tax, formData.discount)
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax: taxAmount,
      totalAmount,
    }))
  }

  const handleSupplierChange = (supplierId: string) => {
    const supplier = mockSuppliers.find((s) => s.id === supplierId)
    setFormData((prev) => ({
      ...prev,
      supplierId,
      supplierName: supplier?.name || "",
    }))
  }

  const handleWarehouseChange = (warehouseId: string) => {
    const warehouse = mockWarehouses.find((w) => w.id === warehouseId)
    setFormData((prev) => ({
      ...prev,
      warehouseId,
      warehouseName: warehouse?.name || "",
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.receiptNumber) {
      newErrors.receiptNumber = t("stockIn.validation.receiptNumberRequired")
    }
    if (!formData.supplierId) {
      newErrors.supplier = t("stockIn.validation.supplierRequired")
    }
    if (!formData.warehouseId) {
      newErrors.warehouse = t("stockIn.validation.warehouseRequired")
    }
    if (formData.items.length === 0) {
      newErrors.items = t("stockIn.validation.productsRequired")
    }

    formData.items.forEach((item, index) => {
      if (!item.productId) {
        newErrors[`item_${index}_product`] = t("stockIn.validation.productRequired")
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = t("stockIn.validation.quantityRequired")
      }
      if (!item.unitCost || item.unitCost <= 0) {
        newErrors[`item_${index}_unitCost`] = t("stockIn.validation.unitCostRequired")
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave(formData)
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
          <DialogTitle>{stockIn ? t("stockIn.form.title.edit") : t("stockIn.form.title.create")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="receiptNumber">{t("stockIn.form.receiptNumber")}</Label>
              <Input
                id="receiptNumber"
                value={formData.receiptNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, receiptNumber: e.target.value }))}
                className={errors.receiptNumber ? "border-red-500" : ""}
              />
              {errors.receiptNumber && <p className="text-sm text-red-500 mt-1">{errors.receiptNumber}</p>}
            </div>

            <div>
              <Label htmlFor="date">{t("stockIn.date")}</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="supplier">{t("stockIn.supplier")}</Label>
              <Select value={formData.supplierId} onValueChange={handleSupplierChange}>
                <SelectTrigger className={errors.supplier ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("stockIn.form.selectSupplier")} />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplier && <p className="text-sm text-red-500 mt-1">{errors.supplier}</p>}
            </div>

            <div>
              <Label htmlFor="warehouse">{t("stockIn.warehouse")}</Label>
              <Select value={formData.warehouseId} onValueChange={handleWarehouseChange}>
                <SelectTrigger className={errors.warehouse ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("stockIn.form.selectWarehouse")} />
                </SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.warehouse && <p className="text-sm text-red-500 mt-1">{errors.warehouse}</p>}
            </div>

            <div>
              <Label htmlFor="referenceNumber">{t("stockIn.form.referenceNumber")}</Label>
              <Input
                id="referenceNumber"
                value={formData.referenceNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, referenceNumber: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="status">{t("stockIn.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("stockIn.status.draft")}</SelectItem>
                  <SelectItem value="pending">{t("stockIn.status.pending")}</SelectItem>
                  <SelectItem value="in_transit">{t("stockIn.status.in_transit")}</SelectItem>
                  <SelectItem value="completed">{t("stockIn.status.completed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t("stockIn.products")}
                </CardTitle>
                <Button onClick={addProduct} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("stockIn.form.addProduct")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {errors.items && <p className="text-sm text-red-500 mb-4">{errors.items}</p>}

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <Label>{t("stockIn.form.selectProduct")}</Label>
                        <Select value={item.productId} onValueChange={(value) => updateItem(index, "productId", value)}>
                          <SelectTrigger className={errors[`item_${index}_product`] ? "border-red-500" : ""}>
                            <SelectValue placeholder={t("stockIn.form.selectProduct")} />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.sku}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`item_${index}_product`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_product`]}</p>
                        )}
                      </div>

                      <div>
                        <Label>{t("stockIn.form.quantity")}</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                          className={errors[`item_${index}_quantity`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </div>

                      <div>
                        <Label>{t("stockIn.form.unitCost")}</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateItem(index, "unitCost", Number.parseInt(e.target.value) || 0)}
                          className={errors[`item_${index}_unitCost`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_unitCost`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_unitCost`]}</p>
                        )}
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <Label>{t("stockIn.form.totalCost")}</Label>
                          <div className="text-lg font-semibold">{formatCurrency(item.totalCost)}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t("stockIn.form.subtotal")}:</span>
                  <span className="font-semibold">{formatCurrency(formData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("stockIn.form.tax")} (10%):</span>
                  <span className="font-semibold">{formatCurrency(formData.subtotal * 0.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("stockIn.form.discount")}:</span>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = Number.parseInt(e.target.value) || 0
                      const { subtotal, taxAmount, totalAmount } = calculateTotals(formData.items, 10, discount)
                      setFormData((prev) => ({ ...prev, discount, tax: taxAmount, totalAmount }))
                    }}
                    className="w-32 text-right"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>{t("stockIn.totalAmount")}:</span>
                  <span>{formatCurrency(formData.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">{t("stockIn.notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              {t("stockIn.form.cancel")}
            </Button>
            <Button onClick={handleSave}>{t("stockIn.form.save")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
