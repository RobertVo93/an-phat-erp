import { UtilityStatus, UtilityType, UtilityUnit } from "@/types/enums";
import { IBase } from "./base.interface";

export interface Utility extends IBase{
  id?: string
  type?: UtilityType
  provider?: string
  accountNumber?: string
  location?: string
  monthlyUsage?: number
  unit?: UtilityUnit
  costPerUnit?: number
  monthlyCost?: number
  lastReading?: string
  status?: UtilityStatus
  dueDate?: string
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
  dueDateFrom?: string
  dueDateTo?: string
  costFrom?: number
  costTo?: number
}

export type UtilitySortField = "type" | "provider" | "location" | "monthlyCost" | "dueDate" | "status"
export type SortDirection = "asc" | "desc"
