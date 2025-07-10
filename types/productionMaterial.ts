import { IBase } from "./base.interface"
import { Product } from "./product"
import { ProductionRecord } from "./production"

export interface ProductionMaterial extends IBase{
  id?: string
  quantity?: number
  totalCost?: number
  production?: ProductionRecord
  material?: Product
}
