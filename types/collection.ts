import { CollectionStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { Product } from "./product";

export interface Collection extends IBase {
  number?: string
  name?: string
  description?: string
  status?: CollectionStatus
  image?: string

  products?: Product[]
}

export interface CollectionFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  name?: string;
  status?: string;
  search?: string;
}
