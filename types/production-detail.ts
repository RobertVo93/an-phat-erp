import type { Employee, Product, Utility, Warehouse } from "@/types";
import type { IProductionElement, ProductionRecord } from "./production";

export type IProductionDetailDate = string;

export interface IProductionDetailProduct extends Omit<Product, "createdAt" | "updatedAt" | "collections" | "warehouseProducts"> {
  createdAt?: IProductionDetailDate;
  updatedAt?: IProductionDetailDate;
}

export interface IProductionDetailWarehouse extends Omit<Warehouse, "createdAt" | "updatedAt" | "stockChanges" | "warehouseProducts" | "orders" | "productionRecords"> {
  createdAt?: IProductionDetailDate;
  updatedAt?: IProductionDetailDate;
}

export interface IProductionDetailEmployee extends Omit<Employee, "createdAt" | "updatedAt" | "hireDate" | "attendanceRecords" | "productionRecords"> {
  createdAt?: IProductionDetailDate;
  updatedAt?: IProductionDetailDate;
  hireDate?: IProductionDetailDate;
}

export interface IProductionDetail extends Omit<ProductionRecord, "createdAt" | "updatedAt" | "date" | "warehouse" | "product" | "pic"> {
  id: string;
  createdAt?: IProductionDetailDate;
  updatedAt?: IProductionDetailDate;
  date?: IProductionDetailDate;
  warehouse?: IProductionDetailWarehouse;
  product?: IProductionDetailProduct;
  pic?: IProductionDetailEmployee;
  materials?: IProductionElement[];
  utilities?: IProductionElement[];
  labors?: IProductionElement[];
}

export interface IProductionDetailPageData {
  record: IProductionDetail | null;
  availableProducts: Product[];
  availableMaterials: Product[];
  availableUtilities: Utility[];
  availableEmployees: Employee[];
  availableWarehouses: Warehouse[];
}
