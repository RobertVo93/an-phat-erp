import { StockChangeStatus, StockChangeType } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { Warehouse as IWarehouse } from "./warehouse";
import { ProductionRecord as IProductionRecord } from "./production";


export interface StockChange extends IBase {
  number?: string
  type?: StockChangeType,
  date?: Date
  supplier?: string
  warehouse?: IWarehouse;
  productionRecord?: IProductionRecord;
  status?: StockChangeStatus
  stockProducts?: IStockProduct[]
  subtotal?: number
  tax?: number
  discount?: number
  totalAmount?: number
  notes?: string
  receivedBy?: string
  receivedDate?: Date
}

export interface IStockProduct {
  id?: string
  unitCost?: number
  quantity?: number
  totalCost?: number
  name?: string
  sku?: string
  unit?: string
}

export interface StockChangeFilters extends IBaseFilters {
  searchTerm?: string,
  status?: string
  supplier?: string
  warehouse?: string
  dateFrom?: string
  dateTo?: string
  amountFrom?: number
  amountTo?: number
}

export type StockChangeSortBy = "date" | "supplier" | "amount" | "status"