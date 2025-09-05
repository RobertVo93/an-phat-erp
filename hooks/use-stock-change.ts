"use client"

import { useState, useMemo, useEffect } from "react"
import type { StockChange, StockChangeFilters, StockChangeSortBy } from "@/types/stock-change"
import { getAllStockChanges as apiGetAllStockChanges, addStockChange as apiAddStockChange, updateStockChange as apiUpdateStockChange, deleteStockChange as apiDeleteStockChange } from "@/lib/httpclient/stock-change.client"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { getProducts } from "@/lib/httpclient"
import { Product, ProductStatus, Warehouse, WarehouseStatus } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useStockChange() {
  const [stockChangeRecords, setStockChangeRecords] = useState<StockChange[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<StockChangeFilters>({})
  const [sortBy, setSortBy] = useState<StockChangeSortBy>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProdducts] = useState<Product[]>([])
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedStockChange, setSelectedStockChange] = useState<StockChange | null>(null);
  const [editingStockChange, setEditingStockChange] = useState<StockChange | null>(null);

  const filteredAndSortedRecords = useMemo(() => {
    const filtered = stockChangeRecords.filter((record) => {
      const matchesSearch =
        record.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.warehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      record.stockProducts?.some(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku?.toLowerCase().includes(searchTerm.toLowerCase()),
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
      toast({
        title: "Error",
        description: "Failed to add stock change",
        variant: "destructive",
      })
      return false;
    } finally {
      setLoading(false)
    }
  }

  const deleteStockChange = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteStockChange(id)
      setStockChangeRecords((prev) => prev.filter((record) => record.id !== id))
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to delete stock change",
        variant: "destructive",
      })
      return false;
    } finally {
      setLoading(false)
    }
  }

  const getWarehousesAndProducts = async () => {
    try {
      setLoading(true)
      const response = await Promise.all([
        getWarehouses({
          status: WarehouseStatus.active
        }),
        getProducts({
          status: ProductStatus.active,
          limit: 1000,
          page: 1,
        })
      ])
      setWarehouses(response[0].data)
      setProdducts(response[1].data)
    } catch (e) {
      console.error(e)
      toast({
        title: "Error",
        description: "Failed to get warehouses and products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllStockChanges()
    getWarehousesAndProducts()
  }, [])

  const handleSort = (field: StockChangeSortBy): void => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleView = (stockChange: StockChange): void => {
    setSelectedStockChange(stockChange);
    setShowViewModal(true);
  };

  const handleEdit = (stockChange: StockChange): void => {
    setEditingStockChange(stockChange);
    setShowFormModal(true);
  };

  const handleDelete = (stockChange: StockChange): void => {
    setSelectedStockChange(stockChange);
    setShowDeleteModal(true);
  };

  const handleSave = async (stockChangeData: Omit<StockChange, "id" | "createdAt" | "updatedAt">): Promise<boolean> => {
    try {
      setLoading(true);
      if (editingStockChange) {
        const updated = await apiUpdateStockChange(editingStockChange.id!, stockChangeData);
        setStockChangeRecords((prev) =>
          prev.map((record) => (record.id === editingStockChange.id ? { ...record, ...updated } : record)),
        );
      } else {
        await addStockChange(stockChangeData);
      }
      return true;
    }
    catch(error) {
      toast({
        title: "Error",
        description: "Failed to save stock change",
        variant: "destructive",
      })
      return false;
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (): void => {
    if (selectedStockChange) {
      deleteStockChange(selectedStockChange.id!);
      setSelectedStockChange(null);
    }
  };

  return {
    stockChangeRecords: paginatedRecords,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalPages,
    loading,
    products,
    warehouses,
    showFormModal,
    showViewModal,
    showFilterModal,
    showDeleteModal,
    selectedStockChange,
    editingStockChange,
    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    setShowFormModal,
    setShowViewModal,
    setShowFilterModal,
    setShowDeleteModal,
    setEditingStockChange,
    handleSort,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleDeleteConfirm,
  };
}
