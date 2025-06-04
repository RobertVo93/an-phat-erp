import { StockOutStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { Warehouse as IWarehouse } from "./warehouse";

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

export interface StockOut extends IBase{
  receiptNumber?: string
  date?: Date
  products?: StockOutProduct[]
  subtotal?: number
  tax?: number
  discount?: number
  totalAmount?: number
  status?: StockOutStatus
  notes?: string
  receivedBy?: string
  receivedDate?: Date
  referenceNumber?: string

  warehouse?: IWarehouse;
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
