import { CollectionStatus, CollectionCategory } from "@/types/enums";
import { IBase } from "./base.interface";
import { Product } from "./product";

export interface Collection extends IBase {
  name?: string
  description?: string
  status?: CollectionStatus
  category?: CollectionCategory
  image?: string

  products?: Product[]
}

export interface CollectionFilters {
  search: string
  status: string
  category: string
  dateFrom: string
  dateTo: string
}
