export interface Order {
  id: string
  customer: string
  customerEmail?: string
  customerPhone?: string
  date: string
  amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "partial" | "failed" | "refunded"
  paymentMethod: "creditCard" | "debitCard" | "bankTransfer" | "cash" | "paypal"
  items: OrderItem[]
  shippingAddress?: string
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface OrderFilters {
  status?: string
  paymentStatus?: string
  paymentMethod?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  customer?: string
}

export interface OrderSearchParams {
  search: string
  filters: OrderFilters
  page: number
  limit: number
  sortBy: "date" | "amount" | "customer" | "status"
  sortOrder: "asc" | "desc"
}
