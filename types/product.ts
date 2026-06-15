import { ProductStatus, ProductUnit } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { Collection as ICollection } from "./collection";
import { WarehouseProduct } from "./warehouseProduct";

export interface Product extends IBase {
  name?: string
  unit?: ProductUnit
  description?: string
  price?: number
  cost?: number
  stock?: number
  minStock?: number
  sku?: string
  barcode?: string
  status?: ProductStatus
  supplier?: string
  image?: string
  subImages?: string[]
  warehouseProducts?: WarehouseProduct[]

  collections?: ICollection[]
}

export interface ProductFormData {
  name?: string
  unit?: ProductUnit
  description?: string
  price?: number
  cost?: number
  stock?: number
  minStock?: number
  sku?: string
  barcode?: string
  status?: ProductStatus
  supplier?: string
  image?: string
  subImages?: string[]
  
  collections?: ICollection[]
}

export interface ProductFilters extends IBaseFilters {
  collectionId?: string
  status?: string
  search?: string
  priceRange?: {
    min: number
    max: number
  }
  stockRange?: {
    min: number
    max: number
  }
}
