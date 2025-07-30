import { IBase } from "./base.interface"
import { Product } from "./product"
import { Warehouse } from "./warehouse"

export interface WarehouseProduct extends IBase{
  quantity?: number
  warehouse?: Warehouse
  product?: Product
}

export interface IWarehouseSummary {
  product: Product
  totalQuantity: number
}
