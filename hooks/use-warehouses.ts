"use client"

import { useState, useMemo, useEffect } from "react"
import type { Warehouse, WarehouseFilters, WarehouseSortOption } from "@/types/warehouse"
import { getWarehouses as apiGetWarehouses, addWarehouse as apiAddWarehouse, updateWarehouse as apiUpdateWarehouse, deleteWarehouse as apiDeleteWarehouse } from "@/lib/httpclient/warehouse.client"

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<WarehouseFilters>({})
  const [sortOption, setSortOption] = useState<WarehouseSortOption>({
    field: "name",
    direction: "asc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAndSortedWarehouses = useMemo(() => {
    const result = warehouses.filter((warehouse) => {
      const matchesSearch =
        warehouse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.manager?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || warehouse.status === filters.status
      const matchesType = !filters.type || warehouse.type === filters.type
      const matchesTemperature = !filters.temperature || warehouse.temperature === filters.temperature
      const matchesLocation = !filters.location || warehouse.location?.includes(filters.location)

      let matchesUtilization = true
      if (filters.utilizationRange) {
        const utilization = (warehouse.occupied! / warehouse.capacity!) * 100
        matchesUtilization = utilization >= filters.utilizationRange[0] && utilization <= filters.utilizationRange[1]
      }

      return (
        matchesSearch && matchesStatus && matchesType && matchesTemperature && matchesLocation && matchesUtilization
      )
    })

    result.sort((a, b) => {
      const aValue = a[sortOption.field]
      const bValue = b[sortOption.field]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOption.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOption.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return result
  }, [warehouses, searchTerm, filters, sortOption])

  const paginatedWarehouses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedWarehouses.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedWarehouses, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedWarehouses.length / itemsPerPage)

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
      const added = await apiAddWarehouse(newWarehouse)
      setWarehouses([...warehouses, added])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateWarehouse = async (id: string, updates: Partial<Warehouse>) => {
    try {
      setLoading(true)
      const updated = await apiUpdateWarehouse(id, updates)
      setWarehouses(warehouses.map((wh) => (wh.id === id ? { ...wh, ...updated } : wh)))
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
    warehouses: paginatedWarehouses,
    allWarehouses: warehouses,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems: filteredAndSortedWarehouses.length,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
    loading
  }
}
