import { UtilityStatus, UtilityUnit } from "@/types/enums";
import { IBase, IBaseFilters } from "@/types/base.interface";

export interface Utility extends IBase{
  number?: string
  name?: string
  provider?: string
  location?: string
  unit?: UtilityUnit
  costPerUnit?: number
  status?: UtilityStatus
  description?: string
}

export interface UtilityFilters extends IBaseFilters{
  searchTerm?: string
  status?: string
  costFrom?: number
  costTo?: number
}

export type UtilitySortField = "number" | "name" | "provider" | "location" | "status" | "costPerUnit"