import { StockChangeStatus, StockChangeType } from "@/types/enums";
import { IBase } from "./base.interface";
import { Warehouse as IWarehouse } from "./warehouse";
import { StockProduct } from "./stock-product";


export interface StockChange extends IBase{
  receiptNumber?: string
  type?: StockChangeType,
  date?: Date
  subtotal?: number
  tax?: number
  discount?: number
  totalAmount?: number
  status?: StockChangeStatus
  notes?: string
  receivedBy?: string
  receivedDate?: Date
  referenceNumber?: string
  supplier?: string

  warehouse?: IWarehouse;
  stockProducts?: StockProduct[]
}

export interface StockChangeFilters {
  status?: string
  supplier?: string
  warehouse?: string
  dateFrom?: string
  dateTo?: string
  amountFrom?: number
  amountTo?: number
}
