import { CollectionStatus } from "@/types/enums";
import { IBase, IBaseFilters } from "./base.interface";
import { Product } from "./product";

export interface Collection extends IBase {
  number?: string
  name?: string
  description?: string
  status?: CollectionStatus
  image?: string
  saleable?: boolean

  products?: Product[]
}

export interface CollectionFilters extends IBaseFilters {
  name?: string;
  status?: string;
  search?: string;
}
