import { ProductionElementType, ProductionStatus } from "@/types/enums";
import { Product } from "./product";
import { IBase } from "./base.interface";
import { Warehouse } from "./warehouse";
import { Employee } from "./employee";

export interface ProductionRecord extends IBase{
  number?: string
  date?: Date
  quantity?: number
  status?: ProductionStatus
  totalCost?: number
  totalExpense?: number
  warehouse?: Warehouse
  product?: Product
  pic?: Employee

  materials?: IProductionElement[]
  utilities?: IProductionElement[]
  labors?: IProductionElement[]
}

export interface IProductionElement {
  id?: string
  quantity?: number
  unitCost?: number
  totalCost?: number
  name?: string
  unit?: string
  type?: ProductionElementType
  number?: string
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
