import { useCallback, useEffect, useMemo, useState } from "react"
import { endOfMonth, startOfMonth } from "date-fns"
import { env } from "@/constants/env"
import { getAllUtilityUsagesByFilter } from "@/lib/httpclient/utility-usage.client"
import { formatMonthYear } from "@/lib/utils"
import type { IInvoiceUtility, Invoice } from "@/types/invoice"
import { InvoiceStatus, type IUtilityUsage, type Utility, UtilityUnit } from "@/types"
import type { MutationMode } from "@/types/base.interface"
import type { IInvoiceFormData, IInvoiceUtilityUsage } from "@/components/invoices/invoice-form-modal/types"

interface IUseInvoiceFormParams {
  allUtilities: Utility[]
  isOpen: boolean
  invoice?: Invoice
  mode: MutationMode
  onSave: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => void
  t: (key: string) => string
}

const defaultInvoice: Invoice & { billingPeriodDate: Date } = {
  billingPeriod: formatMonthYear(new Date()),
  billingPeriodDate: new Date(),
  issueDate: new Date(),
  dueDate: endOfMonth(new Date()),
  subtotal: 0,
  taxRate: env.NEXT_PUBLIC_TAX_RATE,
  taxAmount: 0,
  otherFees: 0,
  otherFeesDescription: "",
  total: 0,
  status: InvoiceStatus.draft,
  notes: "",
  utilities: [],
  utilityUsages: [],
}

export function useInvoiceForm({ allUtilities, isOpen, invoice, mode, onSave, t }: IUseInvoiceFormParams) {
  const [formData, setFormData] = useState<IInvoiceFormData>(defaultInvoice)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [periodUtilityUsages, setPeriodUtilityUsages] = useState<IUtilityUsage[]>([])
  const [utilityUsageRows, setUtilityUsageRows] = useState<IInvoiceUtilityUsage[]>([])

  useEffect(() => {
    if (invoice && mode === "update") {
      const billingPeriodSplit = invoice.billingPeriod?.split("-")
      const month = Number(billingPeriodSplit?.[0] || 1)
      const year = Number(billingPeriodSplit?.[1] || new Date().getFullYear())
      setFormData({
        ...invoice,
        billingPeriodDate: new Date(year, month - 1, 1),
      })
    } else {
      setFormData(defaultInvoice)
    }
    setErrors({})
  }, [invoice, mode, isOpen, allUtilities])

  const fetchUtilityUsagesByBillingPeriod = useCallback(async (billingPeriodDate?: Date) => {
    if (!billingPeriodDate) return
    setUtilityUsageRows([])

    try {
      const rows = await getAllUtilityUsagesByFilter({
        periodStart: startOfMonth(billingPeriodDate),
        periodEnd: endOfMonth(billingPeriodDate),
        status: "completed",
      })
      setPeriodUtilityUsages(rows || [])
    } catch (error) {
      console.error(error)
      setPeriodUtilityUsages([])
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    fetchUtilityUsagesByBillingPeriod(formData.billingPeriodDate)
  }, [formData.billingPeriodDate, isOpen, fetchUtilityUsagesByBillingPeriod])

  useEffect(() => {
    if (!isOpen || mode !== "update" || !invoice?.utilityUsages?.length) return
    if (!periodUtilityUsages.length) return

    const invoiceUsageById = new Map(
      (invoice.utilityUsages || [])
        .filter((usage) => Boolean(usage.id))
        .map((usage) => [usage.id as string, usage])
    )
    const groupedRows = new Map<string, IInvoiceUtilityUsage>()

    periodUtilityUsages.forEach((usage) => {
      if (!usage.id || !usage.utility?.id) return
      const matchedInvoiceUsage = invoiceUsageById.get(usage.id)
      if (!matchedInvoiceUsage) return

      const utilityId = usage.utility.id
      const existing = groupedRows.get(utilityId)
      if (existing) {
        existing.quantity = (existing.quantity || 0) + (usage.totalUsage || 0)
        existing.totalCost = (existing.totalCost || 0) + (matchedInvoiceUsage.totalCost || 0)
        existing.usageIds = [...(existing.usageIds || []), usage.id]
      } else {
        groupedRows.set(utilityId, {
          id: utilityId,
          name: usage.utility.name,
          quantity: usage.totalUsage || 0,
          unit: matchedInvoiceUsage.unit || usage.unit,
          unitCost: matchedInvoiceUsage.unitCost || 0,
          totalCost: matchedInvoiceUsage.totalCost || 0,
          number: usage.number,
          usageIds: [usage.id],
        })
      }
    })

    if (groupedRows.size > 0) {
      setUtilityUsageRows(Array.from(groupedRows.values()))
    }
  }, [invoice, isOpen, mode, periodUtilityUsages])

  const buildInvoiceUtilityUsagesFromRows = useCallback((rows: IInvoiceUtilityUsage[]): IInvoiceUtility[] => {
    return rows
      .map((row) => {
        const listOfUsages = periodUtilityUsages.filter((usage) => row.usageIds?.includes(usage.id || ""))
        return listOfUsages.map((usage) => ({
          id: usage.id,
          name: row.name,
          quantity: usage.totalUsage,
          unit: row.unit,
          number: usage.number,
          unitCost: row.unitCost,
          totalCost: (usage.totalUsage || 0) * (row.unitCost || 0),
        } as IInvoiceUtility))
      })
      .flat()
  }, [periodUtilityUsages])

  const usageGroups = useMemo<IInvoiceUtilityUsage[]>(() => {
    const map = new Map<string, IInvoiceUtilityUsage>()
    periodUtilityUsages.forEach((usage) => {
      if (!usage.id || !usage.utility?.id || !usage.usageTime) return
      const utility = allUtilities.find((item) => item.id === usage.utility?.id)
      if (!map.has(usage.utility.id)) {
        map.set(usage.utility.id, {
          id: usage.utility.id,
          name: usage.utility.name,
          unit: usage.unit,
          usageIds: [],
          quantity: 0,
          unitCost: utility?.costPerUnit || 0,
          totalCost: 0,
        })
      }
      const current = map.get(usage.utility.id)!
      current.usageIds!.push(usage.id)
      current.quantity! += usage.totalUsage || 0
    })
    return Array.from(map.values())
  }, [periodUtilityUsages, allUtilities])

  const totals = useMemo(() => {
    const utilitySubtotal = (formData.utilities || []).reduce((sum, utility) => sum + (utility.totalCost || 0), 0)
    const usageSubtotal = (formData.utilityUsages || []).reduce((sum, usage) => sum + (usage.totalCost || 0), 0)
    const subtotal = utilitySubtotal + usageSubtotal
    const taxAmount = (subtotal * (formData.taxRate || 0)) / 100
    const total = subtotal + taxAmount + (formData.otherFees || 0)

    return {
      subtotal,
      utilitySubtotal,
      usageSubtotal,
      taxAmount,
      total,
    }
  }, [formData])

  const addUtility = useCallback(() => {
    const newUtility: IInvoiceUtility = {
      id: "",
      quantity: 1,
      unitCost: 0,
      totalCost: 0,
      name: "",
      unit: UtilityUnit.other,
      number: "",
    }
    setFormData((prev) => ({
      ...prev,
      utilities: [...(prev.utilities || []), newUtility],
    }))
  }, [])

  const updateUtility = useCallback((index: number, field: "id" | "quantity" | "unitCost", value: string | number) => {
    const updated = [...(formData.utilities || [])]
    if (!updated[index]) return

    if (field === "id") {
      const utility = allUtilities.find((m) => m.id === value)
      if (utility) {
        updated[index] = {
          ...updated[index],
          quantity: 1,
          id: utility.id,
          totalCost: utility.costPerUnit,
          name: utility.name,
          unit: utility.unit,
          number: utility.number,
          unitCost: utility.costPerUnit,
        }
      }
    } else if (field === "quantity") {
      updated[index].quantity = Number(value) || 0
      updated[index].totalCost = (updated[index].quantity || 0) * (updated[index].unitCost || 0)
    } else if (field === "unitCost") {
      updated[index].unitCost = Number(value) || 0
      updated[index].totalCost = (updated[index].quantity || 0) * (updated[index].unitCost || 0)
    }

    setFormData((prev) => ({ ...prev, utilities: updated }))
  }, [allUtilities, formData.utilities])

  const removeUtility = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      utilities: (prev.utilities || []).filter((_, i) => i !== index),
    }))
  }, [])

  const addUtilityUsageRow = useCallback(() => {
    setUtilityUsageRows((prev) => [
      ...prev,
      {
        id: "",
        quantity: 1,
        unitCost: 0,
        totalCost: 0,
        name: "",
        unit: UtilityUnit.other,
        number: "",
        usageIds: [],
      },
    ])
  }, [])

  const updateUtilityUsageRow = useCallback((index: number, field: "id" | "unitCost", value: string | number | undefined) => {
    const nextRows = [...utilityUsageRows]
    const row = nextRows[index]
    if (!row) return

    if (field === "id") {
      const group = usageGroups.find((item) => item.id === value)
      if (!group) return
      const unitCost = group.unitCost || 0
      nextRows[index] = {
        ...row,
        id: group.id,
        name: group.name,
        quantity: group.quantity,
        unit: group.unit,
        unitCost,
        totalCost: (group.quantity || 0) * unitCost,
        usageIds: group.usageIds,
      }
    } else {
      const unitCost = Number(value) || 0
      nextRows[index] = {
        ...row,
        unitCost,
        totalCost: (row.quantity || 0) * unitCost,
      }
    }

    setUtilityUsageRows(nextRows)
    const utilityUsages = buildInvoiceUtilityUsagesFromRows(nextRows)
    setFormData((prev) => ({ ...prev, utilityUsages }))
  }, [buildInvoiceUtilityUsagesFromRows, usageGroups, utilityUsageRows])

  const removeUtilityUsageRow = useCallback((index: number) => {
    setUtilityUsageRows((prev) => {
      const nextRows = prev.filter((_, i) => i !== index)
      const utilityUsages = buildInvoiceUtilityUsagesFromRows(nextRows)
      setFormData((current) => ({ ...current, utilityUsages }))
      return nextRows
    })
  }, [buildInvoiceUtilityUsagesFromRows])

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}
    if (!formData.billingPeriod) newErrors.billingPeriod = t("invoices.form.required")
    if (!formData.issueDate) newErrors.issueDate = t("invoices.form.required")
    if (!formData.dueDate) newErrors.dueDate = t("invoices.form.required")
    if ((formData.utilities || []).length === 0 && utilityUsageRows.length === 0) {
      newErrors.utilities = t("invoices.form.required")
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, t, utilityUsageRows.length])

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return
    const invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt"> = {
      ...formData,
      billingPeriod: formatMonthYear(formData.billingPeriodDate!),
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      total: totals.total,
    }
    onSave(invoiceData)
  }, [formData, onSave, totals, validateForm])

  return {
    formData,
    setFormData,
    errors,
    utilityUsageRows,
    usageGroups,
    totals,
    addUtility,
    updateUtility,
    removeUtility,
    addUtilityUsageRow,
    updateUtilityUsageRow,
    removeUtilityUsageRow,
    handleSubmit,
  }
}
