import { CustomerStatus, CustomerType } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { Order } from "./order";
import { IUser } from "./user";

export interface Customer extends IBase {
  number?: string
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
  totalSpend?: number
  user?: IUser
}

export interface CustomerFilters extends IBaseFilters {
  status?: string
  searchTerm?: string
  customerType?: string
}
