import type { ProductionRecord } from "./production";
import type { Product } from "./product";
import type { StockChange } from "./stock-change";
import type { Warehouse } from "./warehouse";

export type IStockChangeDetailDate = string;

export interface IStockChangeDetailWarehouse extends Omit<Warehouse, "createdAt" | "updatedAt" | "stockChanges" | "warehouseProducts" | "orders" | "productionRecords"> {
  createdAt?: IStockChangeDetailDate;
  updatedAt?: IStockChangeDetailDate;
}

export interface IStockChangeDetailProductionRecord extends Omit<ProductionRecord, "createdAt" | "updatedAt" | "date" | "warehouse"> {
  createdAt?: IStockChangeDetailDate;
  updatedAt?: IStockChangeDetailDate;
  date?: IStockChangeDetailDate;
}

export interface IStockChangeDetail extends Omit<StockChange, "createdAt" | "updatedAt" | "date" | "receivedDate" | "warehouse" | "productionRecord" | "stockProducts"> {
  id: string;
  createdAt?: IStockChangeDetailDate;
  updatedAt?: IStockChangeDetailDate;
  date?: IStockChangeDetailDate;
  receivedDate?: IStockChangeDetailDate;
  warehouse?: IStockChangeDetailWarehouse;
  productionRecord?: IStockChangeDetailProductionRecord;
  stockProducts?: StockChange["stockProducts"];
}

export interface IStockChangeDetailPageData {
  record: IStockChangeDetail | null;
  products: Product[];
  warehouses: Warehouse[];
}
