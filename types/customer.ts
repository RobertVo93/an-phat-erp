import { CustomerStatus, CustomerType } from "@/types/enums";
import { IBase } from "./base.interface";

export interface Customer extends IBase {
  name?: string
  email?: string
  phone?: string
  company?: string
  location?: string
  lastOrder?: Date
  status?: CustomerStatus
  customerType?: CustomerType
  joinDate?: Date
  notes?: string
}

export interface CustomerFilters {
  status?: string
  customerType?: string
  location?: string
  joinDateFrom?: string
  joinDateTo?: string
  totalSpentMin?: number
  totalSpentMax?: number
  orderCountMin?: number
  orderCountMax?: number
}
