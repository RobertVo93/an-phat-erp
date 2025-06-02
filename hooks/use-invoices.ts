"use client"

import { useState, useMemo } from "react"
import type { Invoice, InvoiceFilters, InvoiceSortConfig } from "@/types/invoice"

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "UTL-2024-001",
    propertyId: "prop-1",
    propertyName: "Chung cư An Phát - Căn 1201",
    propertyAddress: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    tenantName: "Nguyễn Văn A",
    tenantPhone: "0123456789",
    tenantEmail: "nguyenvana@gmail.com",
    billingPeriod: "05/2024",
    issueDate: "2024-06-01",
    dueDate: "2024-06-15",
    readings: [
      {
        id: "read-1",
        utilityType: "electricity",
        utilityName: "Điện",
        previousReading: 1250,
        currentReading: 1450,
        consumption: 200,
        unitPrice: 3500,
        total: 700000,
      },
      {
        id: "read-2",
        utilityType: "water",
        utilityName: "Nước",
        previousReading: 45,
        currentReading: 58,
        consumption: 13,
        unitPrice: 25000,
        total: 325000,
      },
    ],
    subtotal: 1025000,
    taxRate: 5,
    taxAmount: 51250,
    otherFees: 150000,
    otherFeesDescription: "Phí dịch vụ chung cư",
    total: 1226250,
    paidAmount: 1226250,
    status: "paid",
    notes: "Thanh toán đầy đủ",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-05T15:30:00Z",
  },
  {
    id: "inv-2",
    invoiceNumber: "UTL-2024-002",
    propertyId: "prop-2",
    propertyName: "Chung cư An Phát - Căn 1502",
    propertyAddress: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    tenantName: "Trần Thị B",
    tenantPhone: "0987654321",
    tenantEmail: "tranthib@gmail.com",
    billingPeriod: "05/2024",
    issueDate: "2024-06-01",
    dueDate: "2024-06-15",
    readings: [
      {
        id: "read-3",
        utilityType: "electricity",
        utilityName: "Điện",
        previousReading: 980,
        currentReading: 1120,
        consumption: 140,
        unitPrice: 3500,
        total: 490000,
      },
      {
        id: "read-4",
        utilityType: "water",
        utilityName: "Nước",
        previousReading: 32,
        currentReading: 41,
        consumption: 9,
        unitPrice: 25000,
        total: 225000,
      },
      {
        id: "read-5",
        utilityType: "gas",
        utilityName: "Gas",
        previousReading: 0,
        currentReading: 0,
        consumption: 1,
        unitPrice: 380000,
        total: 380000,
      },
    ],
    subtotal: 1095000,
    taxRate: 5,
    taxAmount: 54750,
    otherFees: 150000,
    otherFeesDescription: "Phí dịch vụ chung cư",
    total: 1299750,
    paidAmount: 500000,
    status: "partial",
    notes: "Đã thanh toán một phần",
    createdAt: "2024-06-01T11:00:00Z",
    updatedAt: "2024-06-06T09:15:00Z",
  },
  {
    id: "inv-3",
    invoiceNumber: "UTL-2024-003",
    propertyId: "prop-3",
    propertyName: "Chung cư An Phát - Căn 1803",
    propertyAddress: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    tenantName: "Lê Văn C",
    tenantPhone: "0369852147",
    tenantEmail: "levanc@gmail.com",
    billingPeriod: "05/2024",
    issueDate: "2024-06-01",
    dueDate: "2024-06-15",
    readings: [
      {
        id: "read-6",
        utilityType: "electricity",
        utilityName: "Điện",
        previousReading: 2100,
        currentReading: 2350,
        consumption: 250,
        unitPrice: 3500,
        total: 875000,
      },
      {
        id: "read-7",
        utilityType: "water",
        utilityName: "Nước",
        previousReading: 78,
        currentReading: 95,
        consumption: 17,
        unitPrice: 25000,
        total: 425000,
      },
      {
        id: "read-8",
        utilityType: "internet",
        utilityName: "Internet",
        previousReading: 0,
        currentReading: 0,
        consumption: 1,
        unitPrice: 250000,
        total: 250000,
      },
    ],
    subtotal: 1550000,
    taxRate: 5,
    taxAmount: 77500,
    otherFees: 150000,
    otherFeesDescription: "Phí dịch vụ chung cư",
    total: 1777500,
    paidAmount: 0,
    status: "sent",
    notes: "Chờ thanh toán",
    createdAt: "2024-06-01T12:30:00Z",
    updatedAt: "2024-06-01T12:30:00Z",
  },
  {
    id: "inv-4",
    invoiceNumber: "UTL-2024-004",
    propertyId: "prop-4",
    propertyName: "Chung cư An Phát - Căn 2104",
    propertyAddress: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    tenantName: "Phạm Thị D",
    tenantPhone: "0147258369",
    tenantEmail: "phamthid@gmail.com",
    billingPeriod: "04/2024",
    issueDate: "2024-05-01",
    dueDate: "2024-05-15",
    readings: [
      {
        id: "read-9",
        utilityType: "electricity",
        utilityName: "Điện",
        previousReading: 1800,
        currentReading: 2050,
        consumption: 250,
        unitPrice: 3500,
        total: 875000,
      },
      {
        id: "read-10",
        utilityType: "water",
        utilityName: "Nước",
        previousReading: 65,
        currentReading: 82,
        consumption: 17,
        unitPrice: 25000,
        total: 425000,
      },
    ],
    subtotal: 1300000,
    taxRate: 5,
    taxAmount: 65000,
    otherFees: 150000,
    otherFeesDescription: "Phí dịch vụ chung cư",
    total: 1515000,
    paidAmount: 0,
    status: "overdue",
    notes: "Quá hạn thanh toán",
    createdAt: "2024-05-01T10:00:00Z",
    updatedAt: "2024-06-01T08:00:00Z",
  },
]

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<InvoiceFilters>({})
  const [sortConfig, setSortConfig] = useState<InvoiceSortConfig>({
    field: "createdAt",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAndSortedInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesSearch =
        searchTerm === "" ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.billingPeriod.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || invoice.status === filters.status
      const matchesProperty = !filters.propertyId || invoice.propertyId === filters.propertyId

      // For billing period, we compare by month/year
      const matchesBillingPeriodFrom =
        !filters.billingPeriodFrom ||
        new Date(invoice.billingPeriod.split("/").reverse().join("-")) >=
          new Date(filters.billingPeriodFrom.split("/").reverse().join("-"))

      const matchesBillingPeriodTo =
        !filters.billingPeriodTo ||
        new Date(invoice.billingPeriod.split("/").reverse().join("-")) <=
          new Date(filters.billingPeriodTo.split("/").reverse().join("-"))

      const matchesAmountFrom = !filters.amountFrom || invoice.total >= filters.amountFrom
      const matchesAmountTo = !filters.amountTo || invoice.total <= filters.amountTo

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProperty &&
        matchesBillingPeriodFrom &&
        matchesBillingPeriodTo &&
        matchesAmountFrom &&
        matchesAmountTo
      )
    })

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field]
      const bValue = b[sortConfig.field]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [invoices, searchTerm, filters, sortConfig])

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedInvoices.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedInvoices, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedInvoices.length / itemsPerPage)

  const addInvoice = (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setInvoices((prev) => [newInvoice, ...prev])
  }

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updates, updatedAt: new Date().toISOString() } : invoice,
      ),
    )
  }

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
  }

  const getInvoiceById = (id: string) => {
    return invoices.find((invoice) => invoice.id === id)
  }

  const handleSort = (field: keyof Invoice) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const resetFilters = () => {
    setFilters({})
    setSearchTerm("")
    setCurrentPage(1)
  }

  // Statistics
  const stats = useMemo(() => {
    const totalInvoices = invoices.length
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0)
    const paidAmount = invoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0)
    const overdueCount = invoices.filter((invoice) => invoice.status === "overdue").length
    const pendingCount = invoices.filter((invoice) => invoice.status === "sent" || invoice.status === "partial").length

    return {
      totalInvoices,
      totalAmount,
      paidAmount,
      overdueCount,
      pendingCount,
      outstandingAmount: totalAmount - paidAmount,
    }
  }, [invoices])

  return {
    invoices: paginatedInvoices,
    allInvoices: invoices,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    handleSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems: filteredAndSortedInvoices.length,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    resetFilters,
    stats,
  }
}
