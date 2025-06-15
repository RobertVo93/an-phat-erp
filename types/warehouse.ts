import { WarehouseStatus, WarehouseType, WarehouseTemperature } from "@/types/enums";
import { IBase } from "./base.interface";
import { StockChange as IStockChange } from "./stock-change";
import { WarehouseProduct } from "./warehouseProduct";

export interface Warehouse extends IBase{
  name?: string
  location?: string
  address?: string
  manager?: string
  capacity?: number
  occupied?: number
  status?: WarehouseStatus
  type?: WarehouseType
  zones?: number
  temperature?: WarehouseTemperature
  phone?: string
  email?: string
  description?: string

  stockChanges?: IStockChange[]
  warehouseProducts?: WarehouseProduct[]
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
