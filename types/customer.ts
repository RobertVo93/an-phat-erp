export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  location: string
  totalOrders: number
  totalSpent: string
  lastOrder: string
  status: "Active" | "Inactive" | "Pending"
  customerType: "VIP" | "Premium" | "Regular"
  joinDate: string
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
