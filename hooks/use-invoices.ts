"use client"

import { useState, useEffect, useCallback } from "react"
import type { Invoice, InvoiceFilters, InvoiceSortableKey } from "@/types/invoice"
import { Utility, UtilityStatus } from "@/types"
import { getUtilitiesByFilterClient } from "@/lib/httpclient/utility.client"
import { addInvoice as apiAddInvoice, getAllInvoices as apiGetAllInvoices, updateInvoice as apiUpdateInvoice, deleteInvoice as apiDeleteInvoice } from "@/lib/httpclient/invoice.client"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function useInvoices() {
  const { t } = useLanguage()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc"
  })
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [allUtilities, setAllUtilities] = useState<Utility[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const debounceSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  useEffect(() => {
    const getAllUtilities = async () => {
      try {
        setLoading(true)
        const res = await getUtilitiesByFilterClient({
          status: UtilityStatus.active,
          page: 1,
          limit: 1000,
        })
        setAllUtilities(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    getAllUtilities()
  }, [])

  const handleSort = (field: InvoiceSortableKey) => {
    setFilters(prev => {
      if (prev.sortBy === field) {
        return { ...prev, sortBy: field, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc", page: 1 }
      } else {
        return { ...prev, sortBy: field, sortOrder: "asc", page: 1 }
      }
    })
  }
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc"
    })
    setSearchTerm("")
  }

  // Show modals
  const onCreateInvoiceClick = () => {
    setShowCreateModal(true)
    setSelectedInvoice(null)
  }
  const onCloseCreateInvoice = () => {
    setShowCreateModal(false)
    setSelectedInvoice(null)
  }
  const onEditInvoiceClick = (invoice: Invoice) => {
    setShowEditModal(true)
    setSelectedInvoice(invoice)
  }
  const onCloseEditInvoice = () => {
    setShowEditModal(false)
    setSelectedInvoice(null)
  }
  const onViewInvoiceClick = (invoice: Invoice) => {
    setShowViewModal(true)
    setSelectedInvoice(invoice)
  }
  const onCloseViewInvoice = () => {
    setShowViewModal(false)
    setSelectedInvoice(null)
  }
  const onDeleteInvoiceClick = (invoice: Invoice) => {
    setShowDeleteModal(true)
    setSelectedInvoice(invoice)
  }
  const onCloseDeleteInvoice = () => {
    setShowDeleteModal(false)
    setSelectedInvoice(null)
  }

  // Handle actions integrate with backend
  const handleCreateInvoice = async (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    const addInvoice = async (invoice: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
      try {
        setLoading(true)
        await apiAddInvoice(invoice)
        await getInvoices()
        onCloseCreateInvoice()
        toast({
          title: t("common.success"),
          description: t("invoices.success.created"),
        })
      } catch (e) {
        console.error(e)
        toast({
          title: t("common.error.title"),
          description: t("common.error.cannotAdd"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    await addInvoice(invoiceData)
  }
  const handleEditInvoice = async (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
      try {
        setLoading(true)
        await apiUpdateInvoice(id, updates)
        await getInvoices()
        onCloseEditInvoice()
        toast({
          title: t("common.success"),
          description: t("invoices.success.updated"),
        })
      } catch (e) {
        console.error(e)
        toast({
          title: t("common.error.title"),
          description: t("common.error.cannotUpdate"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    if (selectedInvoice) {
      await updateInvoice(selectedInvoice.id!, invoiceData)
    }
  }
  const handleDeleteInvoice = async () => {
    const deleteInvoice = async (id: string) => {
      try {
        setLoading(true)
        await apiDeleteInvoice(id)
        await getInvoices()
        onCloseDeleteInvoice()
        toast({
          title: t("common.success"),
          description: t("invoices.success.deleted"),
        })
      } catch (e) {
        console.error(e)
        toast({
          title: t("common.error.title"),
          description: t("common.error.cannotDelete"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    if (selectedInvoice) {
      await deleteInvoice(selectedInvoice.id!)
    }
  }

  const getInvoices = useCallback(async () => {
    try {
      setLoading(true)
      const apiParams = {
        ...filters,
        searchTerm: debounceSearchTerm || undefined
      }
      const res = await apiGetAllInvoices(apiParams)
      setInvoices(res.data || [])
      setTotalRecords(res.total || 0)
      setTotalPages(Math.ceil((res.total || 0) / (filters.limit || 10)))
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, debounceSearchTerm])

  useEffect(() => {
    getInvoices()
  }, [filters, debounceSearchTerm])

  return {
    invoices,
    searchTerm,
    filters,
    totalRecords,
    totalPages,
    loading,
    allUtilities,
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    selectedInvoice,

    setSearchTerm,
    setFilters,
    resetFilters,
    handleSort,
    handleCreateInvoice,
    handleEditInvoice,
    handleDeleteInvoice,
    onCreateInvoiceClick,
    onEditInvoiceClick,
    onViewInvoiceClick,
    onDeleteInvoiceClick,
    onCloseCreateInvoice,
    onCloseEditInvoice,
    onCloseViewInvoice,
    onCloseDeleteInvoice,
  }
}
