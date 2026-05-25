import { ProductUnit, StockChangeType } from "./enums";
import { Product } from "./product";
import { Dispatch, SetStateAction } from "react";
import { ReportPeriod, ReportViewMode } from "./enums";

export interface IReportStock {
  stockChangeId?: string
  productId: string
  productName: string
  quantity: number
  unit: ProductUnit
  totalCost: number
  type?: StockChangeType,
  date: Date,
  isProductionRelated?: boolean
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

export interface StockReportSummary {
  activeNumber: number
  lowStockNumber: number
  outOfStockNumber: number
  totalValue: number
}
