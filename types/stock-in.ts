import { StockInStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { Warehouse as IWarehouse } from "./warehouse";

export interface StockInItem {
  productId: string
  productName: string
  productSku: string
  quantity: number
  unitCost: number
  totalCost: number
}

export interface StockIn extends IBase{
  receiptNumber?: string
  date?: Date
  items?: StockInItem[]
  subtotal?: number
  tax?: number
  discount?: number
  totalAmount?: number
  status?: StockInStatus
  notes?: string
  receivedBy?: string
  receivedDate?: Date
  referenceNumber?: string

  warehouse?: IWarehouse;
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
