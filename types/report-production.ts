import { ReportViewBy } from "./enums";
import { Product } from "./product";

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
  viewBy: ReportViewBy
  dateFrom?: string
  dateTo?: string
}