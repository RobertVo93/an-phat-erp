import { ProductStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { Collection as ICollection } from "./collection";
import { OrderItem as IOrderItem } from "./order";

export interface Product extends IBase {
  name?: string
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
}

export interface ProductFormData {
  name: string
  description: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  sku: string
  barcode: string
  status: "active" | "inactive"
  supplier: string
  image?: string
}

export interface ProductFilters {
  category?: string
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
