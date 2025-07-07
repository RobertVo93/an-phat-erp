import { UtilityStatus, UtilityType, UtilityUnit } from "@/types/enums";
import { IBase } from "./base.interface";

export interface Utility extends IBase{
  id?: string
  type?: UtilityType
  name?: string
  provider?: string
  location?: string
  unit?: UtilityUnit
  costPerUnit?: number
  status?: UtilityStatus
  description?: string
}

export interface UtilityFilters {
  page?: number;
  limit?: number;
  sortField?: UtilitySortField
  sortDirection?: SortDirection
  searchTerm?: string
  type?: string
  status?: string
  location?: string
  provider?: string
  costFrom?: number
  costTo?: number
}

export type UtilitySortField = "type" | "provider" | "location" | "status"
export type SortDirection = "asc" | "desc"
