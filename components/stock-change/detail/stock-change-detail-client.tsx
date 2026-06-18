"use client"

import { StockChangeFormModal } from "@/components/stock-change/stock-change-form-modal"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { updateStockChange } from "@/lib/httpclient/stock-change.client"
import type { Product, StockChange, Warehouse } from "@/types"
import { StockChangeDetailHeader } from "./stock-change-detail-header"
import { StockChangeInfoCard } from "./stock-change-info-card"
import { StockChangeProductLedger } from "./stock-change-product-ledger"
import { StockChangeTotalCard } from "./stock-change-total-card"
import type {
  IStockChangeDetail,
  IStockChangeDetailProductionRecord,
  IStockChangeDetailWarehouse,
} from "@/types/stock-change-detail"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toIsoDate } from "@/lib/utils"

interface IStockChangeDetailClientProps {
  record: IStockChangeDetail | null
  products: Product[]
  warehouses: Warehouse[]
  taxRate: number
}

const toDateValue = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined
  return value instanceof Date ? value : new Date(value)
}

const toDetailWarehouse = (warehouse: StockChange["warehouse"]): IStockChangeDetailWarehouse | undefined => {
  if (!warehouse) return undefined

  return {
    id: warehouse.id,
    createdAt: toIsoDate(warehouse.createdAt!),
    createdBy: warehouse.createdBy,
    updatedAt: toIsoDate(warehouse.updatedAt!),
    updatedBy: warehouse.updatedBy,
    number: warehouse.number,
    name: warehouse.name,
    address: warehouse.address,
    manager: warehouse.manager,
    status: warehouse.status,
    phone: warehouse.phone,
    email: warehouse.email,
    description: warehouse.description,
    main: warehouse.main,
  }
}

const toDetailProductionRecord = (
  productionRecord: StockChange["productionRecord"],
): IStockChangeDetailProductionRecord | undefined => {
  if (!productionRecord) return undefined

  return {
    id: productionRecord.id,
    createdAt: toIsoDate(productionRecord.createdAt!),
    createdBy: productionRecord.createdBy,
    updatedAt: toIsoDate(productionRecord.updatedAt!),
    updatedBy: productionRecord.updatedBy,
    number: productionRecord.number,
    date: toIsoDate(productionRecord.date!),
    quantity: productionRecord.quantity,
    status: productionRecord.status,
    totalCost: productionRecord.totalCost,
    totalExpense: productionRecord.totalExpense,
    materials: productionRecord.materials,
    utilities: productionRecord.utilities,
    labors: productionRecord.labors,
  }
}

const toFormStockChange = (record: IStockChangeDetail): StockChange => ({
  id: record.id,
  number: record.number,
  type: record.type,
  date: toDateValue(record.date),
  supplier: record.supplier,
  warehouse: record.warehouse as StockChange["warehouse"],
  productionRecord: record.productionRecord as StockChange["productionRecord"],
  status: record.status,
  stockProducts: record.stockProducts,
  subtotal: record.subtotal,
  tax: record.tax,
  discount: record.discount,
  totalAmount: record.totalAmount,
  notes: record.notes,
  receivedBy: record.receivedBy,
  receivedDate: toDateValue(record.receivedDate),
  createdAt: toDateValue(record.createdAt),
  updatedAt: toDateValue(record.updatedAt),
  createdBy: record.createdBy,
  updatedBy: record.updatedBy,
})

const toDetailStockChange = (record: StockChange): IStockChangeDetail | null => {
  if (!record.id) return null

  return {
    id: record.id,
    number: record.number,
    type: record.type,
    date: toIsoDate(record.date!),
    supplier: record.supplier,
    warehouse: toDetailWarehouse(record.warehouse),
    productionRecord: toDetailProductionRecord(record.productionRecord),
    status: record.status,
    stockProducts: record.stockProducts,
    subtotal: record.subtotal,
    tax: record.tax,
    discount: record.discount,
    totalAmount: record.totalAmount,
    notes: record.notes,
    receivedBy: record.receivedBy,
    receivedDate: toIsoDate(record.receivedDate!),
    createdAt: toIsoDate(record.createdAt!),
    updatedAt: toIsoDate(record.updatedAt!),
    createdBy: record.createdBy,
    updatedBy: record.updatedBy,
  }
}

export function StockChangeDetailClient({
  record: initialRecord,
  products,
  warehouses,
  taxRate,
}: IStockChangeDetailClientProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [record, setRecord] = useState<IStockChangeDetail | null>(initialRecord)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!record) {
    return <div className="rounded-2xl border border-dashed py-12 text-center text-muted-foreground">{t("common.noData")}</div>
  }

  const handleSave = async (stockChange: Omit<StockChange, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    try {
      setSaving(true)
      const updated = await updateStockChange(record.id, stockChange)
      const nextRecord = toDetailStockChange(updated as StockChange)
      if (nextRecord) setRecord(nextRecord)
      router.refresh()
      toast({
        title: t("common.success"),
        description: t("common.success.update"),
      })
      return true
    } catch (error) {
      console.error("[StockChangeDetailClient] Failed to update stock-change", error)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotUpdate"),
        variant: "destructive",
      })
      return false
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <StockChangeDetailHeader record={record} onEdit={() => setShowEditModal(true)} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <StockChangeInfoCard record={record} />
            <StockChangeProductLedger record={record} />
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <StockChangeTotalCard record={record} taxRate={taxRate} />
          </aside>
        </div>
      </div>

      <StockChangeFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
        stockChange={toFormStockChange(record)}
        products={products}
        warehouses={warehouses}
        loading={saving}
      />
    </>
  )
}
