import { WarehouseStatus, WarehouseType, WarehouseTemperature } from "@/types/enums";

export interface Warehouse {
  id: string
  name: string
  location: string
  address: string
  manager: string
  capacity: number
  occupied: number
  status: WarehouseStatus
  type: WarehouseType
  zones: number
  temperature: WarehouseTemperature
  phone?: string
  email?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface WarehouseFilters {
  status?: string
  type?: string
  temperature?: string
  location?: string
  utilizationRange?: [number, number]
}

export interface WarehouseSortOption {
  field: keyof Warehouse
  direction: "asc" | "desc"
}
