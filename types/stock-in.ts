export interface StockInItem {
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitCost: number
  totalCost: number
}

export interface StockIn {
  id: string
  receiptNumber: string
  date: string
  supplierId: string
  supplierName: string
  warehouseId: string
  warehouseName: string
  items: StockInItem[]
  subtotal: number
  tax: number
  discount: number
  totalAmount: number
  status: "draft" | "pending" | "in_transit" | "completed" | "cancelled"
  notes?: string
  receivedBy?: string
  receivedDate?: string
  referenceNumber?: string
  createdAt: string
  updatedAt: string
}

export interface StockInFilters {
  status?: string
  supplier?: string
  warehouse?: string
  dateFrom?: string
  dateTo?: string
  amountFrom?: number
  amountTo?: number
}
