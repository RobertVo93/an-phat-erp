import { UtilityStatus } from "@/types/enums";

export interface Utility {
  id: string
  type: string
  provider: string
  accountNumber: string
  location: string
  monthlyUsage: number
  unit: string
  costPerUnit: number
  monthlyCost: number
  lastReading: string
  status: UtilityStatus
  dueDate: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface UtilityFilters {
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
