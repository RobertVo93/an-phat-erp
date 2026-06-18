import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { env } from "@/constants/env"
import { IStockProduct, StockChange, StockChangeStatus, StockChangeType, Warehouse } from "@/types"
import { DEFAULT_STOCK_CHANGE } from "./stock-change-form-constants"
import { IStockChangeFormModalProps } from "./stock-change-form-types"

interface IUseStockChangeFormModalResult {
  formData: StockChange
  errors: Record<string, string>
  setFormData: React.Dispatch<React.SetStateAction<StockChange>>
  addProduct: () => void
  updateItem: (index: number, field: keyof IStockProduct, value: string | number) => void
  removeItem: (index: number) => void
  handleStockTypeChange: (type: StockChangeType) => void
  handleWarehouseChange: (warehouseId: string) => void
  handleSave: (isComplete: boolean) => Promise<void>
}

const resolveDefaultWarehouse = (warehouses: Warehouse[]): Warehouse | undefined => (
  warehouses.find((warehouse) => warehouse.main) || warehouses[0]
)

const buildInitialFormData = (stockChange: StockChange | undefined, warehouses: Warehouse[]): StockChange => {
  if (!stockChange) {
    return {
      ...DEFAULT_STOCK_CHANGE,
      warehouse: resolveDefaultWarehouse(warehouses),
    }
  }

  return {
    number: stockChange.number || "",
    type: stockChange.type,
    date: stockChange.date,
    supplier: stockChange.supplier,
    warehouse: stockChange.warehouse,
    subtotal: stockChange.subtotal,
    tax: stockChange.tax,
    discount: stockChange.discount,
    totalAmount: stockChange.totalAmount,
    status: stockChange.status,
    notes: stockChange.notes || "",
    stockProducts: stockChange.stockProducts || [],
    receivedBy: stockChange.receivedBy,
  }
}

export function useStockChangeFormModal({
  isOpen,
  onClose,
  onSave,
  stockChange,
  products,
  warehouses,
}: IStockChangeFormModalProps): IUseStockChangeFormModalResult {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<StockChange>(() => buildInitialFormData(stockChange, warehouses))
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData(buildInitialFormData(stockChange, warehouses))
    setErrors({})
  }, [stockChange, isOpen, warehouses])

  useEffect(() => {
    const stockProducts = formData.stockProducts || []
    const subtotal = stockProducts.reduce((sum, item) => sum + (item.totalCost || 0), 0)
    const taxAmount = (subtotal * env.NEXT_PUBLIC_TAX_RATE) / 100
    const totalAmount = subtotal + taxAmount - (formData.discount || 0)

    setFormData((prev) => ({
      ...prev,
      subtotal,
      tax: taxAmount,
      totalAmount,
    }))
  }, [formData.stockProducts, formData.discount])

  const addProduct = () => {
    const stockProducts = formData.stockProducts || []
    if (stockProducts.length >= products.length) return

    const newStockProduct: IStockProduct = {
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
    }

    setFormData((prev) => ({
      ...prev,
      stockProducts: [...(prev.stockProducts || []), newStockProduct],
    }))
  }

  const updateItem = (index: number, field: keyof IStockProduct, value: string | number) => {
    const updatedItems = [...(formData.stockProducts || [])]
    const currentItem = updatedItems[index]
    if (!currentItem) return

    updatedItems[index] = { ...currentItem, [field]: value }

    if (field === "id" && typeof value === "string") {
      const product = products.find((item) => item.id === value)
      if (product) {
        const updatedItem = updatedItems[index]
        if (!updatedItem) return

        updatedItem.unitCost = product.price || 0
        updatedItem.quantity = updatedItem.quantity || 1
        updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost
        updatedItem.name = product.name
        updatedItem.sku = product.sku
        updatedItem.unit = product.unit
        updatedItem.id = product.id
      }
    }

    if (field === "quantity" || field === "unitCost") {
      updatedItems[index].totalCost = (updatedItems[index].quantity || 0) * (updatedItems[index].unitCost || 0)
    }

    setFormData((prev) => ({
      ...prev,
      stockProducts: updatedItems,
    }))
  }

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      stockProducts: (prev.stockProducts || []).filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const handleStockTypeChange = (type: StockChangeType) => {
    setFormData((prev) => ({ ...prev, type }))
  }

  const handleWarehouseChange = (warehouseId: string) => {
    const warehouse = warehouses.find((item) => item.id === warehouseId)
    setFormData((prev) => ({ ...prev, warehouse }))
  }

  const validateForm = (isComplete: boolean): boolean => {
    const newErrors: Record<string, string> = {}
    const stockProducts = formData.stockProducts || []

    if (!formData.type) {
      newErrors.type = t("stockIn.validation.typeRequired")
    }
    if (!formData.warehouse) {
      newErrors.warehouse = t("stockIn.validation.warehouseRequired")
    }
    if (stockProducts.length === 0) {
      newErrors.items = t("stockIn.validation.productsRequired")
    }

    stockProducts.forEach((item, index) => {
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

    if (isComplete && !formData.receivedBy?.trim()) {
      newErrors.receivedBy = t("stockIn.validation.receivedByRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (isComplete: boolean): Promise<void> => {
    const shouldComplete = isComplete || formData.status === StockChangeStatus.completed
    if (!validateForm(shouldComplete)) return

    const submitData: StockChange = {
      ...formData,
      status: isComplete ? StockChangeStatus.completed : formData.status,
    }

    const success = await onSave(submitData)
    if (success) onClose()
  }

  return {
    formData,
    errors,
    setFormData,
    addProduct,
    updateItem,
    removeItem,
    handleStockTypeChange,
    handleWarehouseChange,
    handleSave,
  }
}
