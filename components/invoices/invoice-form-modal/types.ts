import type { IInvoiceUtility, Invoice } from "@/types/invoice"
import type { Utility } from "@/types"
import type { MutationMode } from "@/types/base.interface"
import type { Dispatch, SetStateAction } from "react"

export interface IInvoiceUtilityUsage extends IInvoiceUtility {
  usageIds?: string[]
}

export interface IInvoiceFormData extends Invoice {
  billingPeriodDate?: Date
}

export interface IInvoiceTotals {
  subtotal: number
  utilitySubtotal: number
  usageSubtotal: number
  taxAmount: number
  total: number
}

export interface InvoiceFormModalProps {
  isOpen: boolean
  invoice?: Invoice
  mode: MutationMode
  allUtilities: Utility[]
  onClose: () => void
  onSave: (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => void
}

export type TranslateFn = (key: string) => string
export type ErrorMap = Record<string, string>
export type UtilityUsageUpdater = (index: number, field: "id" | "unitCost", value: string | number | undefined) => void
export type FormUpdater = Dispatch<SetStateAction<IInvoiceFormData>>
export type UtilityRowsUpdater = Dispatch<SetStateAction<IInvoiceUtilityUsage[]>>
