import { WarehouseStatus } from "@/types/enums";
import { IBase } from "./base.interface";
import { StockChange as IStockChange } from "./stock-change";
import { WarehouseProduct } from "./warehouseProduct";
import type { Order as IOrder } from "@/types/order";
import type { ProductionRecord as IProductionRecord } from "@/types/production";

export interface Warehouse extends IBase{
  number?: string
  name?: string
  address?: string
  manager?: string
  status?: WarehouseStatus
  phone?: string
  email?: string
  description?: string
  main?: boolean

  stockChanges?: IStockChange[]
  warehouseProducts?: WarehouseProduct[]
  orders?: IOrder[];
  productionRecords?: IProductionRecord[];
}

export interface WarehouseFilters {
  status?: WarehouseStatus
  location?: string
}

export interface WarehouseSortOption {
  field: keyof Warehouse
  direction: "asc" | "desc"
}
