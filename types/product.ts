import { ProductStatus, ProductUnit } from "@/types/enums";
import { IBase } from "./base.interface";
import { Collection as ICollection } from "./collection";
import { OrderItem as IOrderItem } from "./order";
import { StockProduct } from "./stock-product";

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

  collections?: ICollection[]
  orderItems?: IOrderItem[]
  stockProducts?: StockProduct[]
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
  
  collections?: ICollection[]
}

export interface ProductFilters {
  collectionId?: string
  status?: string
  priceRange?: {
    min: number
    max: number
  }
  stockRange?: {
    min: number
    max: number
  }
}
