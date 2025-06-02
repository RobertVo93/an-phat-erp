"use client"

import { useState, useMemo } from "react"
import type { StockIn, StockInFilters } from "@/types/stock-in"

// Mock data for stock-in records
const mockStockInData: StockIn[] = [
  {
    id: "1",
    receiptNumber: "SI-2024-001",
    date: "2024-01-15",
    supplierId: "sup1",
    supplierName: "Tech Supplies Co.",
    warehouseId: "wh1",
    warehouseName: "Kho Chính",
    items: [
      {
        productId: "p1",
        productName: "Laptop Dell XPS 13",
        productSku: "DELL-XPS13",
        quantity: 10,
        unitCost: 25000000,
        totalCost: 250000000,
      },
      {
        productId: "p2",
        productName: "Chuột Không Dây",
        productSku: "MOUSE-WL",
        quantity: 50,
        unitCost: 500000,
        totalCost: 25000000,
      },
    ],
    subtotal: 275000000,
    tax: 27500000,
    discount: 0,
    totalAmount: 302500000,
    status: "completed",
    receivedBy: "Nguyễn Văn A",
    receivedDate: "2024-01-15",
    referenceNumber: "PO-2024-001",
    notes: "Hàng nhập từ nhà cung cấp chính",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    receiptNumber: "SI-2024-002",
    date: "2024-01-14",
    supplierId: "sup2",
    supplierName: "Office Solutions Ltd.",
    warehouseId: "wh2",
    warehouseName: "Kho Chi Nhánh Bắc",
    items: [
      {
        productId: "p3",
        productName: "Ghế Văn Phòng",
        productSku: "CHAIR-OFF",
        quantity: 15,
        unitCost: 3000000,
        totalCost: 45000000,
      },
      {
        productId: "p4",
        productName: "Đèn Bàn LED",
        productSku: "LAMP-LED",
        quantity: 25,
        unitCost: 800000,
        totalCost: 20000000,
      },
    ],
    subtotal: 65000000,
    tax: 6500000,
    discount: 1000000,
    totalAmount: 70500000,
    status: "pending",
    referenceNumber: "PO-2024-002",
    notes: "Chờ xác nhận từ kho",
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "3",
    receiptNumber: "SI-2024-003",
    date: "2024-01-13",
    supplierId: "sup3",
    supplierName: "Electronics Hub",
    warehouseId: "wh1",
    warehouseName: "Kho Chính",
    items: [
      {
        productId: "p5",
        productName: "iPhone 15 Pro",
        productSku: "IP15-PRO",
        quantity: 20,
        unitCost: 30000000,
        totalCost: 600000000,
      },
    ],
    subtotal: 600000000,
    tax: 60000000,
    discount: 5000000,
    totalAmount: 655000000,
    status: "in_transit",
    referenceNumber: "PO-2024-003",
    notes: "Hàng đang trên đường vận chuyển",
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T14:00:00Z",
  },
  {
    id: "4",
    receiptNumber: "SI-2024-004",
    date: "2024-01-12",
    supplierId: "sup4",
    supplierName: "Home & Garden Co.",
    warehouseId: "wh3",
    warehouseName: "Kho Dự Phòng",
    items: [
      {
        productId: "p6",
        productName: "Bộ Dụng Cụ Làm Vườn",
        productSku: "GARDEN-SET",
        quantity: 8,
        unitCost: 2500000,
        totalCost: 20000000,
      },
    ],
    subtotal: 20000000,
    tax: 2000000,
    discount: 0,
    totalAmount: 22000000,
    status: "draft",
    referenceNumber: "PO-2024-004",
    notes: "Phiếu nháp, chưa xác nhận",
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-12T11:00:00Z",
  },
]

export function useStockIn() {
  const [stockInRecords, setStockInRecords] = useState<StockIn[]>(mockStockInData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<StockInFilters>({})
  const [sortBy, setSortBy] = useState<"date" | "supplier" | "amount" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAndSortedRecords = useMemo(() => {
    const filtered = stockInRecords.filter((record) => {
      const matchesSearch =
        record.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.items.some(
          (item) =>
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.productSku.toLowerCase().includes(searchTerm.toLowerCase()),
        )

      const matchesStatus = !filters.status || record.status === filters.status
      const matchesSupplier =
        !filters.supplier || record.supplierName.toLowerCase().includes(filters.supplier.toLowerCase())
      const matchesWarehouse =
        !filters.warehouse || record.warehouseName.toLowerCase().includes(filters.warehouse.toLowerCase())

      const recordDate = new Date(record.date)
      const matchesDateFrom = !filters.dateFrom || recordDate >= new Date(filters.dateFrom)
      const matchesDateTo = !filters.dateTo || recordDate <= new Date(filters.dateTo)

      const matchesAmountFrom = !filters.amountFrom || record.totalAmount >= filters.amountFrom
      const matchesAmountTo = !filters.amountTo || record.totalAmount <= filters.amountTo

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
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "supplier":
          aValue = a.supplierName.toLowerCase()
          bValue = b.supplierName.toLowerCase()
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
  }, [stockInRecords, searchTerm, filters, sortBy, sortOrder])

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedRecords.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedRecords, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage)

  const addStockIn = (stockIn: Omit<StockIn, "id" | "createdAt" | "updatedAt">) => {
    const newStockIn: StockIn = {
      ...stockIn,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setStockInRecords((prev) => [newStockIn, ...prev])
  }

  const updateStockIn = (id: string, updates: Partial<StockIn>) => {
    setStockInRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updates, updatedAt: new Date().toISOString() } : record,
      ),
    )
  }

  const deleteStockIn = (id: string) => {
    setStockInRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const getStockInById = (id: string) => {
    return stockInRecords.find((record) => record.id === id)
  }

  const resetFilters = () => {
    setFilters({})
    setSearchTerm("")
    setCurrentPage(1)
  }

  return {
    stockInRecords: paginatedRecords,
    allStockInRecords: stockInRecords,
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
    addStockIn,
    updateStockIn,
    deleteStockIn,
    getStockInById,
    resetFilters,
  }
}
