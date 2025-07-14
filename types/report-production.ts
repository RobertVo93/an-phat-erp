import { ReportViewBy, ReportViewType } from "./enums";
import { Product } from "./product";

export interface ReportColumn {
  key: string
  title: string
}

export interface ReportTableProps {
  headers: ReportColumn[]
  data: Record<string, any | number>[]
}

export interface ProductionFormat {
  productId: string
  name: string
  quantity: number
  totalPrice: number
  totalCost: number
  profit: number
  time: string
}

export interface ReportProductionFilter {
  products?: Product[]
  dateFrom?: string
  dateTo?: string
}