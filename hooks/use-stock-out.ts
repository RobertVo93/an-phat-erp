"use client"

import { useState, useMemo } from "react"
import type { StockOut, StockOutFilters, StockOutSort } from "@/types/stock-out"

// Mock data for stock-out records
const mockStockOuts: StockOut[] = [
  {
    id: "1",
    receiptNumber: "SO-2024-001",
    date: "2024-01-15",
    customerId: "1",
    customerName: "Công ty TNHH Công nghệ ABC",
    customerPhone: "0901234567",
    customerAddress: "123 Đường Nguyễn Văn Linh, Q.7, TP.HCM",
    warehouseId: "1",
    warehouseName: "Kho Chính",
    products: [
      {
        id: "1",
        productId: "1",
        productName: "Laptop Dell XPS 13",
        sku: "DELL-XPS13-001",
        quantity: 2,
        unitPrice: 25000000,
        totalPrice: 50000000,
        availableStock: 15,
      },
      {
        id: "2",
        productId: "2",
        productName: "Chuột không dây Logitech",
        sku: "LOG-MOUSE-001",
        quantity: 5,
        unitPrice: 500000,
        totalPrice: 2500000,
        availableStock: 50,
      },
    ],
    subtotal: 52500000,
    discount: 2500000,
    discountType: "fixed",
    tax: 5000000,
    totalAmount: 55000000,
    status: "shipped",
    orderReference: "ORD-2024-001",
    trackingNumber: "VN123456789",
    shippingMethod: "Giao hàng nhanh",
    notes: "Giao hàng trong giờ hành chính",
    processedBy: "Nguyễn Văn A",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    receiptNumber: "SO-2024-002",
    date: "2024-01-14",
    customerId: "2",
    customerName: "Cửa hàng Điện tử XYZ",
    customerPhone: "0987654321",
    customerAddress: "456 Đường Lê Văn Việt, Q.9, TP.HCM",
    warehouseId: "2",
    warehouseName: "Kho Phụ",
    products: [
      {
        id: "3",
        productId: "3",
        productName: "iPhone 15 Pro",
        sku: "APPLE-IP15P-001",
        quantity: 1,
        unitPrice: 30000000,
        totalPrice: 30000000,
        availableStock: 8,
      },
    ],
    subtotal: 30000000,
    discount: 5,
    discountType: "percentage",
    tax: 2850000,
    totalAmount: 31350000,
    status: "processing",
    orderReference: "ORD-2024-002",
    trackingNumber: "",
    shippingMethod: "Giao hàng tiêu chuẩn",
    notes: "",
    processedBy: "Trần Thị B",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    receiptNumber: "SO-2024-003",
    date: "2024-01-13",
    customerId: "3",
    customerName: "Siêu thị Điện máy DEF",
    customerPhone: "0912345678",
    customerAddress: "789 Đường Võ Văn Tần, Q.3, TP.HCM",
    warehouseId: "1",
    warehouseName: "Kho Chính",
    products: [
      {
        id: "4",
        productId: "4",
        productName: "Máy in Canon LBP",
        sku: "CANON-LBP-001",
        quantity: 3,
        unitPrice: 3500000,
        totalPrice: 10500000,
        availableStock: 12,
      },
    ],
    subtotal: 10500000,
    discount: 500000,
    discountType: "fixed",
    tax: 1000000,
    totalAmount: 11000000,
    status: "delivered",
    orderReference: "ORD-2024-003",
    trackingNumber: "VN987654321",
    shippingMethod: "Giao hàng nhanh",
    notes: "Đã giao thành công",
    processedBy: "Lê Văn C",
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
]

export function useStockOut() {
  const [stockOuts, setStockOuts] = useState<StockOut[]>(mockStockOuts)
  const [filters, setFilters] = useState<StockOutFilters>({
    search: "",
    status: "",
    customerId: "",
    warehouseId: "",
    dateFrom: "",
    dateTo: "",
    amountFrom: "",
    amountTo: "",
  })
  const [sort, setSort] = useState<StockOutSort>({
    field: "date",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAndSortedStockOuts = useMemo(() => {
    const filtered = stockOuts.filter((stockOut) => {
      const matchesSearch =
        stockOut.receiptNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        stockOut.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        stockOut.warehouseName.toLowerCase().includes(filters.search.toLowerCase()) ||
        stockOut.products.some(
          (p) =>
            p.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.sku.toLowerCase().includes(filters.search.toLowerCase()),
        )

      const matchesStatus = !filters.status || stockOut.status === filters.status
      const matchesCustomer = !filters.customerId || stockOut.customerId === filters.customerId
      const matchesWarehouse = !filters.warehouseId || stockOut.warehouseId === filters.warehouseId

      const matchesDateFrom = !filters.dateFrom || stockOut.date >= filters.dateFrom
      const matchesDateTo = !filters.dateTo || stockOut.date <= filters.dateTo

      const matchesAmountFrom = !filters.amountFrom || stockOut.totalAmount >= Number.parseFloat(filters.amountFrom)
      const matchesAmountTo = !filters.amountTo || stockOut.totalAmount <= Number.parseFloat(filters.amountTo)

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCustomer &&
        matchesWarehouse &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesAmountFrom &&
        matchesAmountTo
      )
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sort.field]
      let bValue: any = b[sort.field]

      if (sort.field === "date") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sort.field === "totalAmount") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else {
        aValue = String(aValue).toLowerCase()
        bValue = String(bValue).toLowerCase()
      }

      if (sort.direction === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [stockOuts, filters, sort])

  const paginatedStockOuts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedStockOuts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedStockOuts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedStockOuts.length / itemsPerPage)

  const addStockOut = (stockOut: Omit<StockOut, "id" | "receiptNumber" | "createdAt" | "updatedAt">) => {
    const newStockOut: StockOut = {
      ...stockOut,
      id: Date.now().toString(),
      receiptNumber: `SO-${new Date().getFullYear()}-${String(stockOuts.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setStockOuts([newStockOut, ...stockOuts])
  }

  const updateStockOut = (id: string, updates: Partial<StockOut>) => {
    setStockOuts(
      stockOuts.map((stockOut) =>
        stockOut.id === id ? { ...stockOut, ...updates, updatedAt: new Date().toISOString() } : stockOut,
      ),
    )
  }

  const deleteStockOut = (id: string) => {
    setStockOuts(stockOuts.filter((stockOut) => stockOut.id !== id))
  }

  const getStockOutById = (id: string) => {
    return stockOuts.find((stockOut) => stockOut.id === id)
  }

  return {
    stockOuts: paginatedStockOuts,
    allStockOuts: stockOuts,
    filteredCount: filteredAndSortedStockOuts.length,
    totalCount: stockOuts.length,
    filters,
    setFilters,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    addStockOut,
    updateStockOut,
    deleteStockOut,
    getStockOutById,
  }
}
