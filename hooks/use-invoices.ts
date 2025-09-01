"use client"

import { useState, useMemo, useEffect } from "react"
import type { Invoice, InvoiceFilters, InvoiceSortConfig } from "@/types/invoice"
import { InvoiceStatus, Utility } from "@/types"
import { getUtilitiesByFilterClient } from "@/lib/httpclient/utility.client"
import { addInvoice as apiAddInvoice, getAllInvoices as apiGetAllInvoices, updateInvoice as apiUpdateInvoice, deleteInvoice as apiDeleteInvoice } from "@/lib/httpclient/invoice.client"

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<InvoiceFilters>({})
  const [sortConfig, setSortConfig] = useState<InvoiceSortConfig>({
    field: "createdAt",
    direction: "desc",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [allUtilities, setAllUtilities] = useState<Utility[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getAllUtilities = async () => {
    try {
      setLoading(true)
      const res = await getUtilitiesByFilterClient()
      setAllUtilities(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllUtilities()
  }, [])

  const filteredAndSortedInvoices = useMemo(() => {
    const filtered = invoices?.filter((invoice) => {
      const matchesSearch =
        searchTerm === "" ||
        invoice.invoiceNumber!.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.billingPeriod!.toString().toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || invoice.status === filters.status

      // For billing period, we compare by month/year
      const matchesBillingPeriodFrom =
        !filters.billingPeriodFrom ||
        new Date(invoice.billingPeriod!) >=
        new Date(filters.billingPeriodFrom)

      const matchesBillingPeriodTo =
        !filters.billingPeriodTo ||
        new Date(invoice.billingPeriod!) <=
        new Date(filters.billingPeriodTo)

      const matchesAmountFrom = !filters.amountFrom || invoice.total! >= filters.amountFrom
      const matchesAmountTo = !filters.amountTo || invoice.total! <= filters.amountTo

      return (
        matchesSearch &&
        matchesStatus &&
        matchesBillingPeriodFrom &&
        matchesBillingPeriodTo &&
        matchesAmountFrom &&
        matchesAmountTo
      )
    })

    // Sort
    filtered?.sort((a, b) => {
      const aValue = a[sortConfig.field]
      const bValue = b[sortConfig.field]

      if (aValue! < bValue!) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue! > bValue!) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [invoices, searchTerm, filters, sortConfig])

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedInvoices?.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedInvoices, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedInvoices?.length / itemsPerPage)

  const getAllInvoices = async () => {
    try {
      setLoading(true)
      const res = await apiGetAllInvoices()
      setInvoices(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      const added = await apiAddInvoice(invoice)
      setInvoices((prev) => [added, ...prev])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    try {
      setLoading(true)
      const updated = await apiUpdateInvoice(id, updates)
      setInvoices((prev) => prev.map((invoice) => invoice.id === id ? updated : invoice))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteInvoice(id)
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
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
    const totalInvoices = invoices?.length
    const totalAmount = invoices?.reduce((sum, invoice) => sum + invoice.total!, 0)
    const overdueCount = invoices?.filter((invoice) => invoice.status === InvoiceStatus.overdue).length
    const pendingCount = invoices?.filter((invoice) => invoice.status === InvoiceStatus.paid).length

    return {
      totalInvoices,
      totalAmount,
      overdueCount,
      pendingCount,
    }
  }, [invoices])

  useEffect(() => {
    getAllInvoices()
  }, [])

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
    totalItems: filteredAndSortedInvoices?.length,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    resetFilters,
    stats,
    loading,
    allUtilities
  }
}
