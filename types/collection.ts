import { CollectionStatus, CollectionCategory } from "@/types/enums";

export interface Collection {
  id: string
  name: string
  description: string
  productCount: number
  status: CollectionStatus
  createdDate: string
  totalValue: string
  category: CollectionCategory
  products?: Product[]
  image?: string
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
