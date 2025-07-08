"use client"

import { useEffect, useState } from "react"
import type { ProductionRecord } from "@/types/production"
import { Employee, EmployeeStatus, Product, ProductStatus, Utility, UtilityStatus } from "@/types"
import { getProducts as apiGetProducts } from "@/lib/httpclient"
import { createProduction, getAllProductions, updateProduction } from "@/lib/httpclient/production.client"
import { isTodayLocalDatetime } from "@/lib/utils"
import { getAllUtilities } from "@/lib/httpclient/utility.client"
import { getEmployee } from '@/lib/httpclient/employee.client';

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
  const [loading, setLoading] = useState<boolean>(false)

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
      setHistoryProductionRecords((prev) =>
        prev.map((item) =>
          item.id === updated.id ? updated : item
        )
      );
      setIsEditModalOpen(false)
      setEditingRecord(null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onInit()
  }, [])

  useEffect(() => {
    const todayRecords = historyProductionRecords.filter(item => isTodayLocalDatetime(item.date!))
    setTodayProductionRecords(todayRecords)
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
  }
}
