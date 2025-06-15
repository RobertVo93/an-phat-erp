"use client"

import { useState, useMemo, useEffect } from "react"
import type { StockChange, StockChangeFilters } from "@/types/stock-change"
import { getAllStockChanges as apiGetAllStockChanges, addStockChange as apiAddStockChange, updateStockChange as apiUpdateStockChange, deleteStockChange as apiDeleteStockChange } from "@/lib/httpclient/stock-change.client"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { getProducts } from "@/lib/httpclient"
import { Product, Warehouse } from "@/types"

export function useStockChange() {
  const [stockChangeRecords, setStockChangeRecords] = useState<StockChange[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<StockChangeFilters>({})
  const [sortBy, setSortBy] = useState<"date" | "supplier" | "amount" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProdducts] = useState<Product[]>([])

  const filteredAndSortedRecords = useMemo(() => {
    const filtered = stockChangeRecords.filter((record) => {
      const matchesSearch =
        record.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.warehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      record.stockProducts?.some(
        (item) =>
          item.product?.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product?.sku!.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      const matchesStatus = !filters.status || record.status === filters.status
      const matchesSupplier =
        !filters.supplier || record.supplier?.toLowerCase().includes(filters.supplier.toLowerCase())
      const matchesWarehouse =
        !filters.warehouse || record.warehouse?.name?.toLowerCase().includes(filters.warehouse.toLowerCase())

      const recordDate = new Date(record.date!)
      const matchesDateFrom = !filters.dateFrom || recordDate >= new Date(filters.dateFrom)
      const matchesDateTo = !filters.dateTo || recordDate <= new Date(filters.dateTo)

      const matchesAmountFrom = !filters.amountFrom || record.totalAmount! >= filters.amountFrom
      const matchesAmountTo = !filters.amountTo || record.totalAmount! <= filters.amountTo

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSupplier &&
        matchesWarehouse &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesAmountFrom &&
        matchesAmountTo
      )
    })

    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.date!)
          bValue = new Date(b.date!)
          break
        case "supplier":
          aValue = a.supplier!.toLowerCase()
          bValue = b.supplier!.toLowerCase()
          break
        case "amount":
          aValue = a.totalAmount
          bValue = b.totalAmount
          break
        case "status":
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [stockChangeRecords, searchTerm, filters, sortBy, sortOrder])

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedRecords.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedRecords, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage)

  const getAllStockChanges = async () => {
    try {
      setLoading(true)
      const response = await apiGetAllStockChanges()
      setStockChangeRecords(response.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addStockChange = async (stockChange: Omit<StockChange, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      const newStockChange: StockChange = {
        ...stockChange,
        id: Date.now().toString(),
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      }
      const added = await apiAddStockChange(newStockChange)
      setStockChangeRecords((prev) => [added, ...prev])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateStockChange = async (id: string, updates: Partial<StockChange>) => {
    try {
      setLoading(true);
      const updated = await apiUpdateStockChange(id, updates);
      setStockChangeRecords((prev) =>
        prev.map((record) => (record.id === id ? { ...record, ...updated } : record)),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteStockChange = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteStockChange(id)
      setStockChangeRecords((prev) => prev.filter((record) => record.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getStockChangeById = (id: string) => {
    return stockChangeRecords.find((record) => record.id === id)
  }

  const resetFilters = () => {
    setFilters({})
    setSearchTerm("")
    setCurrentPage(1)
  }

  const getWarehousesAndProducts = async () => {
    try {
      setLoading(true)
      const whResponse = await getWarehouses()
      setWarehouses(whResponse.data)
      const prResponse = await getProducts()
      setProdducts(prResponse.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllStockChanges()
    getWarehousesAndProducts()
  }, [])

  return {
    stockChangeRecords: paginatedRecords,
    allStockChangeRecords: stockChangeRecords,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalRecords: filteredAndSortedRecords.length,
    addStockChange,
    updateStockChange,
    deleteStockChange,
    getStockChangeById,
    resetFilters,
    loading,
    products,
    warehouses
  }
}
