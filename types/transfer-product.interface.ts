import { Product, Warehouse } from "@/types"

export interface ITransferProduct {
  sourceWH?: Warehouse
  destinationWH?: Warehouse
  product?: Product
  quantity?: number
}