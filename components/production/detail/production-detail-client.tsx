"use client"

import { ProductionEditModal } from "@/components/production/ProductionEditModal"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { updateProduction } from "@/lib/httpclient/production.client"
import { toIsoDate } from "@/lib/utils"
import type { Employee, Product, Utility, Warehouse } from "@/types"
import type { ProductionRecord } from "@/types/production"
import type { IProductionDetail } from "@/types/production-detail"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ProductionCostSummaryCard } from "./production-cost-summary-card"
import { ProductionDetailHeader } from "./production-detail-header"
import { ProductionElementLedger } from "./production-element-ledger"
import { ProductionInfoCard } from "./production-info-card"
import { Boxes, Hammer, Zap } from "lucide-react"

interface IProductionDetailClientProps {
  record: IProductionDetail | null
  availableProducts: Product[]
  availableMaterials: Product[]
  availableUtilities: Utility[]
  availableEmployees: Employee[]
  availableWarehouses: Warehouse[]
}

const toDateValue = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined
  return value instanceof Date ? value : new Date(value)
}

const toFormProduction = (record: IProductionDetail): ProductionRecord => ({
  id: record.id,
  number: record.number,
  date: toDateValue(record.date),
  quantity: record.quantity,
  status: record.status,
  totalCost: record.totalCost,
  totalExpense: record.totalExpense,
  warehouse: record.warehouse as Warehouse,
  product: record.product as Product,
  pic: record.pic as Employee,
  materials: record.materials ?? [],
  utilities: record.utilities ?? [],
  labors: record.labors ?? [],
  createdAt: toDateValue(record.createdAt),
  updatedAt: toDateValue(record.updatedAt),
  createdBy: record.createdBy,
  updatedBy: record.updatedBy,
})

const toDetailProduction = (record: ProductionRecord): IProductionDetail | null => {
  if (!record.id) return null

  return {
    id: record.id,
    number: record.number,
    date: toIsoDate(record.date),
    quantity: record.quantity,
    status: record.status,
    totalCost: record.totalCost,
    totalExpense: record.totalExpense,
    warehouse: record.warehouse as IProductionDetail["warehouse"],
    product: record.product as IProductionDetail["product"],
    pic: record.pic as IProductionDetail["pic"],
    materials: record.materials ?? [],
    utilities: record.utilities ?? [],
    labors: record.labors ?? [],
    createdAt: toIsoDate(record.createdAt),
    updatedAt: toIsoDate(record.updatedAt),
    createdBy: record.createdBy,
    updatedBy: record.updatedBy,
  }
}

export function ProductionDetailClient({
  record: initialRecord,
  availableProducts,
  availableMaterials,
  availableUtilities,
  availableEmployees,
  availableWarehouses,
}: IProductionDetailClientProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [record, setRecord] = useState<IProductionDetail | null>(initialRecord)
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!record) {
    return <div className="rounded-2xl border border-dashed py-12 text-center text-muted-foreground">{t("common.noData")}</div>
  }

  const handleSave = async (production: ProductionRecord): Promise<void> => {
    try {
      setSaving(true)
      const updated = await updateProduction(record.id, production)
      const nextRecord = toDetailProduction(updated as ProductionRecord)
      if (nextRecord) setRecord(nextRecord)
      setShowEditModal(false)
      router.refresh()
      toast({
        title: t("common.success"),
        description: t("common.success.update"),
      })
    } catch (error) {
      console.error("[ProductionDetailClient] Failed to update production", error)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotUpdate"),
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <ProductionDetailHeader record={record} onEdit={() => setShowEditModal(true)} />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <ProductionInfoCard record={record} />
            <ProductionElementLedger
              title={t("production.recordItem.materialsShort")}
              items={record.materials ?? []}
              icon={Boxes}
              tone="emerald"
            />
            <ProductionElementLedger
              title={t("production.recordItem.utilitiesShort")}
              items={record.utilities ?? []}
              icon={Zap}
              tone="amber"
            />
            <ProductionElementLedger
              title={t("production.recordItem.laborShort")}
              items={record.labors ?? []}
              icon={Hammer}
              tone="slate"
            />
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <ProductionCostSummaryCard record={record} />
          </aside>
        </div>
      </div>

      <ProductionEditModal
        availableMaterials={availableMaterials}
        availableProducts={availableProducts}
        availableUtilities={availableUtilities}
        availableEmployees={availableEmployees}
        availableWarehouses={availableWarehouses}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        record={toFormProduction(record)}
        onSave={handleSave}
        isLoading={saving}
      />
    </>
  )
}
