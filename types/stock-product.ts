import { IBase } from "./base.interface"
import { Product } from "./product"
import { StockChange } from "./stock-change"

export interface StockProduct extends IBase{
  unitCost?: number
  quantity?: number
  stockChange?: StockChange
  totalCost?: number
  
  product?: Product
}
