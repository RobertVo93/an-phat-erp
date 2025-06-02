import { CollectionStatus, CollectionCategory } from "@/types/enums";
import { IBase } from "./base.interface";

export interface Collection extends IBase {
  name?: string
  description?: string
  status?: CollectionStatus
  category?: CollectionCategory
  image?: string

  products?: Product[]
}

export interface Product {
  id: string
  name: string
  price: number
  image?: string
  category: string
  stock: number
}

export interface CollectionFilters {
  search: string
  status: string
  category: string
  dateFrom: string
  dateTo: string
}
