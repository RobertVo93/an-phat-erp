import { Product } from "./product";

export interface ReportProductionFilter {
  products?: Product[]
  dateFrom: Date
  dateTo: Date
}

export interface ProductionReportRow {
  date: string
  revenue: number
  cost: number
  profit: number
  efficiency: number
}

interface ProductionSummaryMetric {
  value: number
}

export interface ProductionSummary {
  revenue: ProductionSummaryMetric
  cost: ProductionSummaryMetric
  profit: ProductionSummaryMetric
}

export interface ProductionProductPerformance {
  product: string
  quantity: number
  revenue: number
  cost: number
  profit: number
  margin: number
}

export type ProductionMetricKey = "revenue" | "cost" | "profit"

export interface ProductionComparisonChartRow {
  label: string
  current: number
  baseline1: number
  baseline2?: number
  baseline3?: number
  baseline1Percent: number | null
  baseline2Percent?: number | null
  baseline3Percent?: number | null
}

export interface ProductionComparisonChartDataset {
  metric: ProductionMetricKey
  titleKey: string
  baseline1LabelKey: string
  baseline2LabelKey?: string
  baseline3LabelKey?: string
  rows: ProductionComparisonChartRow[]
}
