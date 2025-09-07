import { InvoiceStatus, UtilityUnit } from "@/types/enums";
import { IBase, IBaseFilters } from "@/types/base.interface";

export interface Invoice extends IBase{
  number?: string
  billingPeriod?: string
  issueDate?: Date
  dueDate?: Date
  subtotal?: number
  taxRate?: number
  taxAmount?: number
  otherFees?: number
  otherFeesDescription?: string
  total?: number
  status?: InvoiceStatus
  notes?: string

  utilities?: IInvoiceUtility[]
}

export interface IInvoiceUtility {
  id?: string
  quantity?: number
  unitCost?: number
  totalCost?: number
  name?: string
  unit?: UtilityUnit
  number?: string
}

export interface InvoiceFilters extends IBaseFilters{
  status?: string
  billingPeriod?: string
  dueDateFrom?: Date
  dueDateTo?: Date
  amountFrom?: number
  amountTo?: number
  searchTerm?: string
}

export type InvoiceSortableKey = "number" | "billingPeriod" | "issueDate" | "dueDate" | "total" | "status"
