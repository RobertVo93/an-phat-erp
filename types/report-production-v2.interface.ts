import { Product } from "./product"

export interface IReportProductionFilterV2 {
  products?: Product[]
  dateFrom: Date
  dateTo: Date
}

export interface IProductionSummaryMetricV2 {
  value: number
  previousValue: number
  changePercentage: number | null
}

export interface IProductionSummaryV2 {
  revenue: IProductionSummaryMetricV2
  cost: IProductionSummaryMetricV2
  profit: IProductionSummaryMetricV2
}

export type ProductionReportMetricV2 = "revenue" | "cost" | "profit"

export interface IProductionMetricComparisonV2 {
  currentValue: number
  previousValue: number
  changePercentage: number | null
}

export interface IProductionEfficiencyComparisonV2 {
  currentValue: number | null
  previousValue: number | null
}

export interface IProductionMonthlyComparisonRowV2 {
  date: string
  revenue: IProductionMetricComparisonV2
  cost: IProductionMetricComparisonV2
  profit: IProductionMetricComparisonV2
  efficiency: IProductionEfficiencyComparisonV2
}

export interface IProductionReportPeriodLabelsV2 {
  current: string
  previous: string
}
