import type { Employee, Product, Utility, Warehouse } from "@/types";
import type { ProductionRecord } from "./production";

export interface IProductionPageSummary {
  materialCost: number;
  utilityCost: number;
  employeeCost: number;
}

export interface IProductionPageData {
  todayRecords: ProductionRecord[];
  availableProducts: Product[];
  availableMaterials: Product[];
  availableUtilities: Utility[];
  availableEmployees: Employee[];
  availableWarehouses: Warehouse[];
  summary: IProductionPageSummary;
}
