"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Package, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { IStockProduct, Product, StockChange, StockChangeStatus, StockChangeType, Warehouse } from "@/types"
import { formatLargeCurrency, formatNumberWithCommas, parseNumberInput } from "@/lib/utils"
import { env } from "@/constants/env"

interface StockChangeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (stockChange: Omit<StockChange, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  stockChange?: StockChange
  products: Product[]
  warehouses: Warehouse[]
  loading: boolean
}

const defaultStockChange: StockChange = {
  number: "",
  type: StockChangeType.stockIn,
  date: new Date(),
  supplier: "",
  subtotal: 0,
  tax: 0,
  discount: 0,
  totalAmount: 0,
  status: StockChangeStatus.draft,
  notes: "",
  stockProducts: [],
  receivedBy: "",
}

export function StockChangeFormModal({
  isOpen,
  onClose,
  onSave,
  stockChange,
  products,
  warehouses,
  loading
}: StockChangeFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<StockChange>({
    ...defaultStockChange,
    warehouse: warehouses.find((w) => w.main) || warehouses[0]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (stockChange) {
      setFormData({
        number: stockChange.number!,
        type: stockChange.type,
        date: stockChange.date!,
        supplier: stockChange.supplier,
        warehouse: stockChange.warehouse,
        subtotal: stockChange.subtotal,
        tax: stockChange.tax,
        discount: stockChange.discount,
        totalAmount: stockChange.totalAmount,
        status: stockChange.status,
        notes: stockChange.notes || "",
        stockProducts: stockChange.stockProducts,
        receivedBy: stockChange.receivedBy,
      })
    } else {
      setFormData({
        ...defaultStockChange,
        warehouse: warehouses.find((w) => w.main) || warehouses[0]
      })
    }
  }, [stockChange, isOpen])

  useEffect(() => {
    if (formData.stockProducts && formData.stockProducts.length > 0) {
      const subtotal = formData.stockProducts.reduce((sum, item) => sum + (item.totalCost || 0), 0)
      const taxAmount = (subtotal * env.NEXT_PUBLIC_TAX_RATE) / 100
      const totalAmount = subtotal + taxAmount - (formData.discount || 0)
      setFormData((prev) => ({
        ...prev,
        subtotal: subtotal,
        tax: taxAmount,
        totalAmount: totalAmount,
      }))
    }
  }, [formData.stockProducts, formData.discount])

  const addProduct = () => {
    if (formData.stockProducts?.length! < products.length) {
      const newStockProduct: IStockProduct = {
        quantity: 1,
        unitCost: 0,
        totalCost: 0,
      }
      setFormData((prev) => ({ ...prev, stockProducts: [...prev.stockProducts!, newStockProduct] }))
    }
  }

  const updateItem = (index: number, field: keyof IStockProduct, value: any) => {
    const updatedItems = [...formData.stockProducts!]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === "id") {
      const product = products.find((p) => p.id === value)
      if (product) {
        updatedItems[index].unitCost = product.price!
        updatedItems[index].totalCost = updatedItems[index].quantity! * updatedItems[index].unitCost
        updatedItems[index].name = product.name
        updatedItems[index].sku = product.sku
        updatedItems[index].unit = product.unit
        updatedItems[index].id = product.id
      }
    }

    if (field === "quantity" || field === "unitCost") {
      updatedItems[index].totalCost = updatedItems[index].quantity! * updatedItems[index].unitCost!
    }

    setFormData((prev) => ({
      ...prev,
      stockProducts: updatedItems,
    }))
  }

  const removeItem = (index: number) => {
    const updatedItems = formData.stockProducts!.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      stockProducts: updatedItems,
    }))
  }

  const handleStockTypeChange = (type: StockChangeType) => {
    setFormData((prev) => ({
      ...prev,
      type: type
    }))
  }

  const handleWarehouseChange = (warehouseId: string) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId)
    setFormData((prev) => ({
      ...prev,
      warehouse: warehouse
    }))
  }

  const validateForm = (isComplete: boolean) => {
    const newErrors: Record<string, string> = {}

    if (!formData.type!) {
      newErrors.supplier = t("stockIn.validation.typeRequired")
    }
    if (!formData.warehouse!) {
      newErrors.warehouse = t("stockIn.validation.warehouseRequired")
    }
    if (formData.stockProducts!.length === 0) {
      newErrors.items = t("stockIn.validation.productsRequired")
    }

    formData.stockProducts!.forEach((item, index) => {
      if (!item.id) {
        newErrors[`item_${index}_product`] = t("stockIn.validation.productRequired")
      }
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = t("stockIn.validation.quantityRequired")
      }
      if (!item.unitCost || item.unitCost <= 0) {
        newErrors[`item_${index}_unitCost`] = t("stockIn.validation.unitCostRequired")
      }
    })

    if (isComplete) {
      if (!formData.receivedBy) {
        newErrors.receivedBy = t("stockIn.validation.receivedByRequired")
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (isComplete: boolean) => {
    if (!validateForm(isComplete || formData.status === StockChangeStatus.completed)) return

    let submitData = { ...formData }
    if (isComplete) {
      submitData.status = StockChangeStatus.completed
    }
    const success = await onSave(submitData)
    if (success) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{stockChange ? t("stockIn.form.title.edit") : t("stockIn.form.title.create")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">{t("stockIn.stockType")}</Label>
              <Select value={formData.type} onValueChange={handleStockTypeChange}>
                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("stockIn.form.selectStockType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StockChangeType.stockIn}>
                    {t(`stockIn.form.${StockChangeType.stockIn}`)}
                  </SelectItem>
                  <SelectItem value={StockChangeType.stockOut}>
                    {t(`stockIn.form.${StockChangeType.stockOut}`)}
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
            </div>

            <div>
              <Label htmlFor="date">{t("stockIn.date")}</Label>
              <Input
                id="date"
                type="date"
                value={
                  formData.date
                    ? new Date(formData.date).toLocaleDateString("sv-SE")
                    : ""
                }
                onChange={(e) => setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }))}
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
                  {
                    Object.values(StockChangeStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`stockIn.status.${status}`)}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="warehouse">{t("stockIn.warehouse")}</Label>
              <Select value={formData.warehouse?.id} onValueChange={handleWarehouseChange}>
                <SelectTrigger className={errors.warehouse ? "border-red-500" : ""}>
                  <SelectValue placeholder={t("stockIn.form.selectWarehouse")} />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id!}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.warehouse && <p className="text-sm text-red-500 mt-1">{errors.warehouse}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="supplier">{t("stockIn.supplier")}</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData((prev) => ({ ...prev, supplier: e.target.value }))}
              />
              {errors.supplier && <p className="text-sm text-red-500 mt-1">{errors.supplier}</p>}
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
                {formData.stockProducts && formData.stockProducts.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <Label>{t("stockIn.form.selectProduct")}</Label>
                        <Select value={item.id!} onValueChange={(value) => updateItem(index, "id", value)}>
                          <SelectTrigger className={errors[`item_${index}_product`] ? "border-red-500" : ""}>
                            <SelectValue placeholder={t("stockIn.form.selectProduct")} />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .map((product) => (
                                <SelectItem
                                  key={product.id}
                                  value={product.id!}
                                  className={`font-medium ${formData.stockProducts?.some(stockProduct => stockProduct.id === product.id) ? "hidden" : ""}`}
                                >
                                  <div className="font-medium">
                                    {product.name}
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
                          type="text"
                          value={formatNumberWithCommas(item.quantity ?? 0)}
                          onChange={(e) => {
                            const quantity = parseNumberInput(e.target.value);
                            if (quantity > 0) {
                              updateItem(index, "quantity", quantity);
                            }
                          }}
                          className={errors[`item_${index}_quantity`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_quantity`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_quantity`]}</p>
                        )}
                      </div>

                      <div>
                        <Label>{t("stockIn.form.unitCost")}</Label>
                        <Input
                          type="text"
                          value={formatNumberWithCommas(item.unitCost ?? 0)}
                          onChange={(e) => {
                            const unitCost = parseNumberInput(e.target.value);
                            if (unitCost > 0) {
                              updateItem(index, "unitCost", unitCost);
                            }
                          }}
                          className={errors[`item_${index}_unitCost`] ? "border-red-500" : ""}
                        />
                        {errors[`item_${index}_unitCost`] && (
                          <p className="text-sm text-red-500 mt-1">{errors[`item_${index}_unitCost`]}</p>
                        )}
                      </div>

                      <div className="flex items-end justify-between">
                        <div>
                          <Label>{t("stockIn.form.totalCost")}</Label>
                          <div className="text-lg font-semibold">{formatLargeCurrency(item.quantity! * item.unitCost!)}</div>
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
                  <span className="font-semibold">{formatLargeCurrency(formData.subtotal!)}</span>
                </div>
                {
                  env.NEXT_PUBLIC_TAX_RATE > 0 && (
                    <div className="flex justify-between">
                      <span>{t("stockIn.form.tax")} (${env.NEXT_PUBLIC_TAX_RATE}%):</span>
                      <span className="font-semibold">{formatLargeCurrency(formData.subtotal! * env.NEXT_PUBLIC_TAX_RATE)}</span>
                    </div>
                  )
                }
                <div className="flex justify-between">
                  <span>{t("stockIn.form.discount")}:</span>
                  <Input
                    type="text"
                    value={formatNumberWithCommas(formData.discount ?? 0)}
                    onChange={(e) => {
                      const discount = parseNumberInput(e.target.value);
                      setFormData((prev) => ({ ...prev, discount }));
                    }}
                    className="w-32 text-right"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4">
                  <span>{t("stockIn.totalAmount")}:</span>
                  <span>{formatLargeCurrency(formData.totalAmount!)}</span>
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

          {/* Received By */}
          <div>
            <Label htmlFor="receivedBy">{t("stockIn.receivedBy")}</Label>
            <Input 
              id="receivedBy" 
              className={errors.receivedBy ? "border-red-500" : ""} 
              value={formData.receivedBy} 
              onChange={(e) => setFormData((prev) => ({ ...prev, receivedBy: e.target.value }))} 
            />
            {errors.receivedBy && <p className="text-sm text-red-500 mt-1">{errors.receivedBy}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              {t("stockIn.form.cancel")}
            </Button>
            {formData.status !== StockChangeStatus.completed &&
              <Button onClick={() => handleSave(true)} disabled={loading}>{t("stockIn.form.autoComplete")} {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}</Button>
            }
            <Button onClick={() => handleSave(false)} disabled={loading}>{t("stockIn.form.save")} {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
