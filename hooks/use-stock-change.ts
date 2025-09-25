"use client"

import { useState, useMemo, useEffect } from "react"
import type { StockChange, StockChangeFilters, StockChangeSortBy } from "@/types/stock-change"
import { getAllStockChanges as apiGetAllStockChanges, addStockChange as apiAddStockChange, updateStockChange as apiUpdateStockChange, deleteStockChange as apiDeleteStockChange } from "@/lib/httpclient/stock-change.client"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { getProducts } from "@/lib/httpclient"
import { Product, ProductStatus, Warehouse, WarehouseStatus } from "@/types"
import { toast } from "@/hooks/use-toast"
import { useDebounceSearchTerm } from "@/lib/utils.client"

export function useStockChange() {
  const [stockChangeRecords, setStockChangeRecords] = useState<StockChange[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<StockChangeFilters>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProdducts] = useState<Product[]>([])
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAutoCompleteModal, setShowAutoCompeleteModal] = useState<boolean>(false)
  const [selectedStockChange, setSelectedStockChange] = useState<StockChange | null>(null);
  const [editingStockChange, setEditingStockChange] = useState<StockChange | null>(null);

  // pagination
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<StockChangeSortBy>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Debounce searchTerm
  const debouncedSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  // Build params for API
  const apiParams = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
      searchTerm: debouncedSearchTerm,
      status: filters.status === "all" ? undefined : filters.status,
      supplier: filters.supplier === "all" ? undefined : filters.supplier,
      warehouse: filters.warehouse === "all" ? undefined : filters.warehouse,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      amountFrom: filters.amountFrom,
      amountTo: filters.amountTo,
    }
  }, [currentPage, sortBy, sortOrder, debouncedSearchTerm, filters])


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

  const getAllStockChanges = async (params: StockChangeFilters) => {
    try {
      setLoading(true)
      const response = await apiGetAllStockChanges(params)
      setStockChangeRecords(response.data)
      setTotal(response.total)
      setTotalPages(Math.ceil(response.total / (params.limit || 10)))
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

  // fetch when init
  useEffect(() => {
    getWarehousesAndProducts()
  }, [])

  // Fetch orders when params change
  useEffect(() => {
    getAllStockChanges(apiParams)
  }, [apiParams])

  const handleSort = (field: string): void => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field as StockChangeSortBy);
      setSortOrder("desc");
    }
    setCurrentPage(1)
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

  const handleAutoComplete =(stockChange: StockChange): void => {
    setEditingStockChange(stockChange);
    setShowAutoCompeleteModal(true);
  }

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleFiltersChange = (newFilters: StockChangeFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return {
    stockChangeRecords,
    searchTerm,
    filters,
    total,
    pageSize,
    sortBy,
    sortOrder,
    currentPage,
    totalPages,
    loading,
    products,
    warehouses,
    showFormModal,
    showViewModal,
    showFilterModal,
    showDeleteModal,
    showAutoCompleteModal,
    selectedStockChange,
    editingStockChange,
    setSearchTerm,
    setFilters,
    handleFiltersChange,
    setCurrentPage,
    setShowFormModal,
    setShowViewModal,
    setShowFilterModal,
    setShowDeleteModal,
    setShowAutoCompeleteModal,
    setEditingStockChange,
    handleSort,
    handleView,
    handleEdit,
    handleDelete,
    handleAutoComplete,
    handleSave,
    handleDeleteConfirm,
    handlePageChange,
  };
}
