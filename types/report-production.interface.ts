import { Product } from "./product";

export interface IReportRow {
  date: string
  cost: number
  revenue: number
  profit: number
  efficiency: number
  productEfficiencies: { [productName: string]: number }
  [productName: string]: number | string | { [key: string]: number }
}

export interface ReportProductionFilter {
  products?: Product[]
  dateFrom: Date
  dateTo: Date
}