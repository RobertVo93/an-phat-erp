import { UtilityType, InvoiceStatus } from "@/types/enums";

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

export interface Invoice {
  id: string
  invoiceNumber: string
  propertyId: string
  propertyName: string
  propertyAddress: string
  tenantName: string
  tenantPhone: string
  tenantEmail: string
  billingPeriod: string // "MM/YYYY"
  issueDate: string
  dueDate: string
  readings: UtilityReading[]
  subtotal: number
  taxRate: number
  taxAmount: number
  otherFees: number
  otherFeesDescription: string
  total: number
  paidAmount: number
  status: InvoiceStatus
  notes: string
  createdAt: string
  updatedAt: string
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
