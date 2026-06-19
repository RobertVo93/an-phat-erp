"use client"

import { useEffect, useState } from "react"
import type { ProductionRecord } from "@/types/production"
import { Employee, EmployeeStatus, Product, ProductStatus, Utility, Warehouse, WarehouseStatus } from "@/types"
import { getProducts as apiGetProducts } from "@/lib/httpclient"
import { createProduction, getTodayProductions, updateProduction } from "@/lib/httpclient/production.client"
import { getUtilitiesByFilterClient } from "@/lib/httpclient/utility.client"
import { getEmployee } from '@/lib/httpclient/employee.client';
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { toast } from "@/components/ui/use-toast"
import type { IProductionPageData } from "@/types/production-page"

export function useProduction(initialData?: IProductionPageData) {
  const [selectedRecord, setSelectedRecord] = useState<ProductionRecord | null>(null)
  const [todayProductionRecords, setTodayProductionRecords] = useState<ProductionRecord[]>(initialData?.todayRecords ?? [])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ProductionRecord | null>(null)
  const [isNewProductionOpen, setIsNewProductionOpen] = useState(false)
  const [availableProducts, setAvailableProducts] = useState<Product[]>(initialData?.availableProducts ?? [])
  const [availableMaterials, setAvailableMaterials] = useState<Product[]>(initialData?.availableMaterials ?? [])
  const [availableUtilities, setAvailableUtilities] = useState<Utility[]>(initialData?.availableUtilities ?? [])
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>(initialData?.availableEmployees ?? [])
  const [availableWarehouses, setAvailableWarehouses] = useState<Warehouse[]>(initialData?.availableWarehouses ?? [])
  const [loading, setLoading] = useState<boolean>(false)

  // for summary card
  const [todayMaterialCost, setTodayMaterialCost] = useState<number>(initialData?.summary.materialCost ?? 0)
  const [todayUtilityCost, setTodayUtilityCost] = useState<number>(initialData?.summary.utilityCost ?? 0)
  const [todayEmployeeCost, setTodayEmployeeCost] = useState<number>(initialData?.summary.employeeCost ?? 0)

  const onInit = async () => {
    try {
      setLoading(true)
      const response = await Promise.all([
        // get today's productions
        getTodayProductions(),

        apiGetProducts({
          status: ProductStatus.active,
          limit: 1000,
          page: 1,
        }),
        getUtilitiesByFilterClient(),
        getEmployee({
          status: EmployeeStatus.active,
          limit: 1000,
          page: 1,
        }),
        getWarehouses({
          status: WarehouseStatus.active,
        }),
      ])
      setTodayProductionRecords(response[0] as ProductionRecord[])
      setAvailableProducts((response[1].data as Product[]))
      setAvailableMaterials(response[1].data as Product[])
      setAvailableUtilities(response[2].data as Utility[])
      setAvailableEmployees(response[3].data as Employee[])
      setAvailableWarehouses(response[4].data as Warehouse[])
    } catch (e) {
      console.error(e)
      toast({
        title: "Lỗi",
        description: "Tải dữ liệu trang sản xuất thất bại",
        variant: "destructive",
      })
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
      await createProduction(data)
      window.location.reload()
    } catch (e) {
      console.error(e)
      toast({
        title: "Lỗi",
        description: "Tạo mới sản xuất thất bại",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async (updatedRecord: ProductionRecord) => {
    try {
      setLoading(true)
      await updateProduction(updatedRecord.id!, updatedRecord)
      window.location.reload()
    } catch (e) {
      console.error(e)
      toast({
        title: "Lỗi",
        description: "Cập nhật sản xuất thất bại",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTodaySummary = (todayRecords: ProductionRecord[]) => {
    const totalTodayMaterialCost = todayRecords.reduce((sum, record) => {
      const materialCost = record.materials?.reduce((matSum, material) => {
        return matSum + (material.totalCost || 0);
      }, 0) || 0;
      return sum + materialCost;
    }, 0);

    const totalTodayUtilityCost = todayRecords.reduce((sum, record) => {
      const utilityCost = record.utilities?.reduce((ultSum, utility) => {
        return ultSum + (utility.totalCost || 0);
      }, 0) || 0;
      return sum + utilityCost;
    }, 0);

    const totalTodayEmployeeCost = todayRecords.reduce((sum, record) => {
      const employeeCost = record.labors?.reduce((empSum, employee) => {
        return empSum + (employee.totalCost || 0);
      }, 0) || 0;
      return sum + employeeCost;
    }, 0);

    setTodayMaterialCost(totalTodayMaterialCost)
    setTodayUtilityCost(totalTodayUtilityCost)
    setTodayEmployeeCost(totalTodayEmployeeCost)
  }

  useEffect(() => {
    if (initialData) return
    onInit()
  }, [initialData])

  useEffect(() => {
    calculateTodaySummary(todayProductionRecords)
  }, [todayProductionRecords])

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
    materialCost: todayMaterialCost,
    utilityCost: todayUtilityCost,
    employeeCost: todayEmployeeCost,

    handleViewRecord,
    handleEditRecord,
    handleSaveEdit,
    closeDetailModal,
    closeEditModal,
    openNewProduction,
    closeNewProduction,
    createNewProduction,
  }
}
