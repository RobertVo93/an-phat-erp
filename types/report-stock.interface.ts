import { ProductUnit, StockChangeType } from "./enums";
import { Product } from "./product";

export interface IReportStock {
  productId: string
  productName: string
  quantity: number
  unit: ProductUnit
  totalCost: number
  type: StockChangeType,
  date: Date,
}

export interface ReportStockFilter {
  products?: Product[]
  dateFrom: Date
  dateTo: Date
}

export interface ChartData {
  label: string
  stockIn: number
  stockOut: number
}