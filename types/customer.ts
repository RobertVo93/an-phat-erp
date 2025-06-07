import { CustomerStatus, CustomerType } from "@/types/enums";
import { IBase } from "./base.interface";
import { Order } from "./order";

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
  orders?: Order[]
}

export interface CustomerFilters {
  status?: string
  name?: string
  customerType?: string
  location?: string
  joinDateFrom?: string
  joinDateTo?: string
  totalSpentMin?: number
  totalSpentMax?: number
  orderCountMin?: number
  orderCountMax?: number
}
