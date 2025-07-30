import { ProductionStatus } from "@/types/enums";
import { Product } from "./product";
import { IBase } from "./base.interface";
import { ProductionMaterial } from "./productionMaterial";
import { ProductionUtility } from "./productionUtility";
import { ProductionLabor } from "./ProductionLabor";
import { Warehouse } from "./warehouse";
export interface ProductionRecord extends IBase{
  id?: string
  productionNumber?: string
  date?: string
  quantity?: number
  status?: ProductionStatus
  shift?: string
  operator?: string

  product?: Product
  productionMaterials?: ProductionMaterial[]
  productionUtilities?: ProductionUtility[]
  productionLabors?: ProductionLabor[]
  warehouse?: Warehouse

  totalCost?: number
}

export interface Utility {
  id?: string
  name?: string
  unit?: string
  cost?: number
}

export interface SelectedUtility extends Utility{
  quantity?: number
  totalCost?: number
}

export interface SelectedEmployee {
  id: string
  name: string
  position: string
  hours: number
  hourlyRate: number
  totalCost: number
}

export interface DailyProductionData {
  date: string
  noodles: number
  cost: number
  efficiency: number
}

export interface CostBreakdownData {
  name: string
  value: number
  color: string
}
