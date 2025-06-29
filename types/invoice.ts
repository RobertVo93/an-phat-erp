import { InvoiceStatus, ReadingType } from "@/types/enums";
import { IBase } from "./base.interface";
import { Utility as IUtility } from "./utility";
export interface UtilityReading {
  id: string
  utilityType: ReadingType
  utilityName: string
  previousReading: number
  currentReading: number
  consumption: number
  unitPrice: number
  total: number

  utility?: IUtility
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
  billingPeriodFrom?: Date
  billingPeriodTo?: Date
  amountFrom?: number
  amountTo?: number
}

export interface InvoiceSortConfig {
  field: keyof Invoice
  direction: "asc" | "desc"
}
