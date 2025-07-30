"use client"

import { useEffect, useState } from "react"
import type { ProductionRecord } from "@/types/production"
import { Employee, EmployeeStatus, Product, ProductStatus, Utility, UtilityStatus, Warehouse, WarehouseStatus } from "@/types"
import { getProducts as apiGetProducts } from "@/lib/httpclient"
import { createProduction, getAllProductions, updateProduction } from "@/lib/httpclient/production.client"
import { isTodayLocalDatetime } from "@/lib/utils"
import { getAllUtilities } from "@/lib/httpclient/utility.client"
import { getEmployee } from '@/lib/httpclient/employee.client';
import { getWarehouses } from "@/lib/httpclient/warehouse.client"

export function useProduction() {
  const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null)
  const [todayProductionRecords, setTodayProductionRecords] = useState<ProductionRecord[]>([])
  const [historyProductionRecords, setHistoryProductionRecords] = useState<ProductionRecord[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null)
  const [isNewProductionOpen, setIsNewProductionOpen] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [availableMaterials, setAvailableMaterials] = useState<Product[]>([])
  const [availableUtilities, setAvailableUtilities] = useState<Utility[]>([])
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([])
  const [availableWarehouses, setAvailableWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // for summary card
  const [todayMaterialCost, setTodayMaterialCost] = useState<number>(0)
  const [todayUtilityCost, setTodayUtilityCost] = useState<number>(0)
  const [todayEmployeeCost, setTodayEmployeeCost] = useState<number>(0)

  const onInit = async () => {
    try {
      setLoading(true)
      const prResponse = await getAllProductions()
      setHistoryProductionRecords(prResponse.data as ProductionRecord[])

      // get active products
      const pro = await apiGetProducts()
      const activeProducts = (pro.data as Product[]).filter((pro) => pro.status === ProductStatus.active)
      setAvailableProducts(activeProducts)
      setAvailableMaterials(activeProducts)

      // get active utilities
      const ult = await getAllUtilities()
      const activeUtilities = (ult.data as Utility[]).filter((ult) => ult.status === UtilityStatus.active)
      setAvailableUtilities(activeUtilities)

      // get active employee
      const emp = await getEmployee()
      const activeEmployees = (emp.data as Employee[]).filter((e) => e.status === EmployeeStatus.active)
      setAvailableEmployees(activeEmployees)

      // get active warehouses
      const wh = await getWarehouses()
      const activeWarehouses = (wh.data as Warehouse[]).filter((wh) => wh.status === WarehouseStatus.active)
      setAvailableWarehouses(activeWarehouses)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleViewRecord = (record: ProductionRecord) => {
    setSelectedRecord(record)
  }

  const handleEditRecord = (record: ProductionRecord) => {
    setEditingRecord(record)
    setIsEditModalOpen(true)
  }

  const closeDetailModal = () => {
    setSelectedRecord(null)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingRecord(null)
  }

  const openNewProduction = () => {
    setIsNewProductionOpen(true)
  }

  const closeNewProduction = () => {
    setIsNewProductionOpen(false)
  }

  const createNewProduction = async (data: ProductionRecord) => {
    try {
      setLoading(true)
      const created = await createProduction(data)
      setHistoryProductionRecords(prev => [...prev, created])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async (updatedRecord: ProductionRecord) => {
    try {
      setLoading(true)
      const updated = await updateProduction(updatedRecord.id!, updatedRecord)
      if (updated) onInit()
      setIsEditModalOpen(false)
      setEditingRecord(null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const calculateTodaySummary = (todayRecords: ProductionRecord[]) => {
    const totalTodayMaterialCost = todayRecords.reduce((sum, record) => {
      const materialCost = record.productionMaterials?.reduce((matSum, material) => {
        return matSum + (material.totalCost || 0);
      }, 0) || 0;
      return sum + materialCost;
    }, 0);

    const totalTodayUtilityCost = todayRecords.reduce((sum, record) => {
      const utilityCost = record.productionUtilities?.reduce((ultSum, utility) => {
        return ultSum + (utility.totalCost || 0);
      }, 0) || 0;
      return sum + utilityCost;
    }, 0);

    const totalTodayEmployeeCost = todayRecords.reduce((sum, record) => {
      const employeeCost = record.productionLabors?.reduce((empSum, employee) => {
        return empSum + (employee.totalCost || 0);
      }, 0) || 0;
      return sum + employeeCost;
    }, 0);

    setTodayMaterialCost(totalTodayMaterialCost)
    setTodayUtilityCost(totalTodayUtilityCost)
    setTodayEmployeeCost(totalTodayEmployeeCost)
  }

  useEffect(() => {
    onInit()
  }, [])

  useEffect(() => {
    const todayRecords = historyProductionRecords.filter(item => isTodayLocalDatetime(item.date!))
    setTodayProductionRecords(todayRecords)
    calculateTodaySummary(todayRecords)
  }, [historyProductionRecords])

  return {
    selectedRecord,
    isEditModalOpen,
    editingRecord,
    isNewProductionOpen,
    loading,
    availableProducts,
    availableMaterials,
    availableUtilities,
    availableEmployees,
    availableWarehouses,
    todayRecords: todayProductionRecords,
    historyRecords: historyProductionRecords,

    handleViewRecord,
    handleEditRecord,
    handleSaveEdit,
    closeDetailModal,
    closeEditModal,
    openNewProduction,
    closeNewProduction,
    createNewProduction,
    materialCost: todayMaterialCost,
    utilityCost: todayUtilityCost,
    employeeCost: todayEmployeeCost,
  }
}
