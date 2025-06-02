export interface StockOutProduct {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  availableStock: number
}

export interface StockOut {
  id: string
  receiptNumber: string
  date: string
  customerId: string
  customerName: string
  customerPhone: string
  customerAddress: string
  warehouseId: string
  warehouseName: string
  products: StockOutProduct[]
  subtotal: number
  discount: number
  discountType: "percentage" | "fixed"
  tax: number
  totalAmount: number
  status: "draft" | "processing" | "shipped" | "delivered" | "cancelled"
  orderReference?: string
  trackingNumber?: string
  shippingMethod: string
  notes: string
  processedBy: string
  createdAt: string
  updatedAt: string
}

export interface StockOutFilters {
  search: string
  status: string
  customerId: string
  warehouseId: string
  dateFrom: string
  dateTo: string
  amountFrom: string
  amountTo: string
}

export interface StockOutSort {
  field: "date" | "customerName" | "totalAmount" | "status"
  direction: "asc" | "desc"
}
