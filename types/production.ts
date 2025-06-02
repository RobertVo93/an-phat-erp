import { ProductionStatus } from "@/types/enums";

export interface ProductionRecord {
  id: string
  date: string
  product: string
  quantity: number
  unit: string
  status: ProductionStatus
  statusText: string
  shift: string
  operator: string
  rawMaterials: Array<{
    name: string
    quantity: number
    unit: string
    cost: number
  }>
  utilities: Array<{
    name: string
    quantity: number
    unit: string
    cost: number
  }>
  labor: {
    hours: number
    workers: number
    cost: number
  }
  totalCost: number
  efficiency: number
}

export interface Product {
  id: string
  name: string
  unit: string
}

export interface Material {
  id: string
  name: string
  unit: string
  price: number
}

export interface Utility {
  id: string
  name: string
  unit: string
  price: number
}

export interface Employee {
  id: string
  name: string
  position: string
  hourlyRate: number
  department: string
  avatar: string
}

export interface SelectedMaterial {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
  totalCost: number
}

export interface SelectedUtility {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
  totalCost: number
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
