import { WarehouseStatus, WarehouseType, WarehouseTemperature } from "@/types/enums";
import { IBase } from "./base.interface";
import { StockIn as IStockIn } from "./stock-in";
import { StockOut as IStockOut } from "./stock-out";

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

  stockIns?: IStockIn[]
  stockOuts?: IStockOut[]
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
