import { UtilityType, InvoiceStatus } from "@/types/enums";
import { IBase } from "./base.interface";
export interface UtilityReading {
  id: string
  utilityType: UtilityType
  utilityName: string
  previousReading: number
  currentReading: number
  consumption: number
  unitPrice: number
  total: number
}

export interface Invoice extends IBase{
  invoiceNumber?: string
  billingPeriod?: Date
  issueDate?: Date
  dueDate?: Date
  subtotal?: number
  taxRate?: number
  taxAmount?: number
  otherFees?: number
  otherFeesDescription?: string
  total?: number
  paidAmount?: number
  status?: InvoiceStatus
  notes?: string

  readings?: UtilityReading[]
}

export interface InvoiceFilters {
  status?: string
  propertyId?: string
  billingPeriodFrom?: string
  billingPeriodTo?: string
  amountFrom?: number
  amountTo?: number
}

export interface InvoiceSortConfig {
  field: keyof Invoice
  direction: "asc" | "desc"
}
