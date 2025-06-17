import { ProductionStatus } from "@/types/enums";
import { Product } from "./product";
import { IBase } from "./base.interface";
import { ProductionMaterial } from "./productionMaterial";

export interface ProductionRecord extends IBase{
  id?: string
  productionNumber?: string
  date?: string
  quantity?: number
  unit?: string
  status?: ProductionStatus
  statusText?: string
  shift?: string
  operator?: string

  product?: Product
  productionMaterials?: ProductionMaterial[]

  utilities?: Array<{
    name?: string
    quantity?: number
    unit?: string
    cost?: number
  }>
  labor?: {
    hours?: number
    workers?: number
    cost?: number
  }
  totalCost?: number
  efficiency?: number
}

export interface Employee {
  id: string
  name: string
  position: string
  hourlyRate: number
  department: string
  avatar: string
}

//mock interface
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
