import type React from "react"
import { IStockProduct, Product, StockChange, StockChangeStatus, StockChangeType, Warehouse } from "@/types"

export interface IStockChangeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (stockChange: Omit<StockChange, "id" | "createdAt" | "updatedAt">) => Promise<boolean>
  stockChange?: StockChange
  products: Product[]
  warehouses: Warehouse[]
  loading: boolean
}

export interface IStockChangeFormSectionProps {
  formData: StockChange
  errors: Record<string, string>
  setFormData: React.Dispatch<React.SetStateAction<StockChange>>
}

export interface IStockChangeBasicInfoSectionProps extends IStockChangeFormSectionProps {
  warehouses: Warehouse[]
  onStockTypeChange: (type: StockChangeType) => void
  onWarehouseChange: (warehouseId: string) => void
}

export interface IStockChangeProductsSectionProps {
  stockProducts: IStockProduct[]
  products: Product[]
  errors: Record<string, string>
  onAddProduct: () => void
  onUpdateItem: (index: number, field: keyof IStockProduct, value: string | number) => void
  onRemoveItem: (index: number) => void
}

export interface IStockChangeTotalsSectionProps {
  formData: StockChange
  setFormData: React.Dispatch<React.SetStateAction<StockChange>>
}

export interface IStockChangeNotesSectionProps extends IStockChangeFormSectionProps {}

export interface IStockChangeActionsProps {
  status?: StockChangeStatus
  loading: boolean
  onClose: () => void
  onSave: (isComplete: boolean) => void
}
