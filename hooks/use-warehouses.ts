"use client"

import { useState, useMemo } from "react"
import type { Warehouse, WarehouseFilters, WarehouseSortOption } from "@/types/warehouse"

const mockWarehouses: Warehouse[] = [
  {
    id: "WH-001",
    name: "Kho Chính",
    location: "TP. Hồ Chí Minh",
    address: "123 Khu Công Nghiệp, Quận 7",
    manager: "Nguyễn Văn Quản Lý",
    capacity: 10000,
    occupied: 7500,
    status: "Active",
    type: "Distribution Center",
    zones: 12,
    temperature: "Ambient",
    phone: "028-1234-5678",
    email: "warehouse1@company.com",
    description: "Kho phân phối chính tại TP.HCM",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-01",
  },
  {
    id: "WH-002",
    name: "Chi Nhánh Miền Bắc",
    location: "Hà Nội",
    address: "456 Đại Lộ Logistics, Quận Đống Đa",
    manager: "Trần Thị Giám Sát",
    capacity: 5000,
    occupied: 3200,
    status: "Active",
    type: "Regional Hub",
    zones: 8,
    temperature: "Ambient",
    phone: "024-9876-5432",
    email: "warehouse2@company.com",
    description: "Trung tâm khu vực miền Bắc",
    createdAt: "2024-02-20",
    updatedAt: "2024-11-28",
  },
  {
    id: "WH-003",
    name: "Kho Lạnh",
    location: "TP. Hồ Chí Minh",
    address: "789 Đường Chuỗi Lạnh, Quận 2",
    manager: "Lê Văn Lạnh",
    capacity: 2000,
    occupied: 1800,
    status: "Active",
    type: "Cold Storage",
    zones: 4,
    temperature: "Refrigerated",
    phone: "028-5555-6666",
    email: "coldstorage@company.com",
    description: "Kho bảo quản lạnh chuyên dụng",
    createdAt: "2024-03-10",
    updatedAt: "2024-12-01",
  },
  {
    id: "WH-004",
    name: "Kho Dự Phòng",
    location: "Đà Nẵng",
    address: "321 Đường Kho Bãi, Quận Hải Châu",
    manager: "Phạm Thị Dự Phòng",
    capacity: 3000,
    occupied: 500,
    status: "Maintenance",
    type: "Backup Storage",
    zones: 6,
    temperature: "Ambient",
    phone: "0236-7777-8888",
    email: "backup@company.com",
    description: "Kho dự phòng khu vực miền Trung",
    createdAt: "2024-04-05",
    updatedAt: "2024-11-30",
  },
]

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses)
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
        warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || warehouse.status === filters.status
      const matchesType = !filters.type || warehouse.type === filters.type
      const matchesTemperature = !filters.temperature || warehouse.temperature === filters.temperature
      const matchesLocation = !filters.location || warehouse.location.includes(filters.location)

      let matchesUtilization = true
      if (filters.utilizationRange) {
        const utilization = (warehouse.occupied / warehouse.capacity) * 100
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

  const addWarehouse = (warehouse: Omit<Warehouse, "id" | "createdAt" | "updatedAt">) => {
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: `WH-${String(warehouses.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setWarehouses([...warehouses, newWarehouse])
  }

  const updateWarehouse = (id: string, updates: Partial<Warehouse>) => {
    setWarehouses(
      warehouses.map((warehouse) =>
        warehouse.id === id
          ? { ...warehouse, ...updates, updatedAt: new Date().toISOString().split("T")[0] }
          : warehouse,
      ),
    )
  }

  const deleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id))
  }

  const getWarehouseById = (id: string) => {
    return warehouses.find((warehouse) => warehouse.id === id)
  }

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
    getWarehouseById,
  }
}
