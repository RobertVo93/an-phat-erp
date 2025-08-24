"use client"

import { useState, useEffect } from "react"
import type { Warehouse } from "@/types/warehouse"
import {
  getWarehouses as apiGetWarehouses,
  addWarehouse as apiAddWarehouse,
  updateWarehouse as apiUpdateWarehouse,
  deleteWarehouse as apiDeleteWarehouse,
} from "@/lib/httpclient/warehouse.client"

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const handleCreateWarehouse = () => {
    setFormMode("create")
    setSelectedWarehouse(null)
    setIsFormModalOpen(true)
  }

  const handleEditWarehouse = (warehouse: any) => {
    setFormMode("edit")
    setSelectedWarehouse(warehouse)
    setIsFormModalOpen(true)
  }

  const handleViewWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse)
    setIsViewModalOpen(true)
  }

  const handleDeleteWarehouse = (warehouse: any) => {
    setSelectedWarehouse(warehouse)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedWarehouse && selectedWarehouse.id) {
      deleteWarehouse(selectedWarehouse.id)
      setIsDeleteModalOpen(false)
      setSelectedWarehouse(null)
    }
  }

  const getWarehouses = async () => {
    try {
      setLoading(true)
      const response = await apiGetWarehouses()
      setWarehouses(response.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addWarehouse = async (warehouse: Omit<Warehouse, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      const newWarehouse: Warehouse = {
        ...warehouse,
        id: `WH-${String(warehouses.length + 1).padStart(3, "0")}`,
        createdAt: new Date().toISOString().split("T")[0] as any,
        updatedAt: new Date().toISOString().split("T")[0] as any,
      }
      await apiAddWarehouse(newWarehouse)
      await getWarehouses();
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateWarehouse = async (id: string, updates: Partial<Warehouse>) => {
    try {
      setLoading(true)
      await apiUpdateWarehouse(id, updates)
      await getWarehouses();
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteWarehouse = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteWarehouse(id)
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getWarehouses()
  }, [])

  return {
    warehouses,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,
    selectedWarehouse,
    formMode,
    addWarehouse,
    updateWarehouse,
    handleCreateWarehouse,
    handleViewWarehouse,
    handleEditWarehouse,
    handleDeleteWarehouse,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    confirmDelete,
  }
}
