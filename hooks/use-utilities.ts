"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Utility, UtilityFilters, UtilitySortField } from "@/types/utility"
import { 
  addUtilityClient as apiAddUtility, 
  getUtilitiesByFilterClient as apiGetAllUtilities, 
  updateUtilityClient as apiUpdateUtility, 
  deleteUtilityClient as apiDeleteUtility 
} from "@/lib/httpclient/utility.client"
import { MutationMode } from "@/types/base.interface"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useDebounceSearchTerm } from "@/lib/utils.client"

export function useUtilities() {
  const { t } = useLanguage()
  const [utilities, setUtilities] = useState<Utility[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<UtilityFilters>({
    page: 1,
    limit: 10,
    sortBy: "number",
    sortOrder: "desc"
  })
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUtility, setSelectedUtility] = useState<Utility | null>(null)
  const [formMode, setFormMode] = useState<MutationMode>("create")

  const debounceSearchTerm = useDebounceSearchTerm(searchTerm, 500);
  const hasActiveFilters = useMemo(() => Object.keys(filters).some((key) => {
    if (key === 'page' || key === 'limit' || key === 'sortBy' || key === 'sortOrder') return false
    return filters[key as keyof typeof filters] !== undefined && filters[key as keyof typeof filters] !== ""
  }), [filters])


  const handleSort = (field: UtilitySortField) => {
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
      sortBy: "number",
      sortOrder: "desc"
    })
    setSearchTerm("")
  }

  // Show modals
  const handleCreateUtility = () => {
    setFormMode("create")
    setSelectedUtility(null)
    setIsFormModalOpen(true)
  }
  const handleCloseCreateUtility = () => {
    setIsFormModalOpen(false)
  }
  const handleEditUtility = (utility: Utility) => {
    setFormMode("update")
    setSelectedUtility(utility)
    setIsFormModalOpen(true)
  }
  const handleCloseEditUtility = () => {
    setSelectedUtility(null)
    setIsFormModalOpen(false)
  }
  const handleViewUtility = (utility: Utility) => {
    setSelectedUtility(utility)
    setIsViewModalOpen(true)
  }
  const handleDeleteUtility = (utility: Utility) => {
    setSelectedUtility(utility)
    setIsDeleteModalOpen(true)
  }
  const handleCloseDeleteUtility = () => {
    setSelectedUtility(null)
    setIsDeleteModalOpen(false)
  }

  // Handle actions integrate with backend
  const confirmDelete = () => {
    if (selectedUtility) deleteUtility(selectedUtility.id!)
  }
  const addUtility = async (utility: Omit<Utility, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      await apiAddUtility(utility)
      await getUtilities()
      handleCloseCreateUtility()
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
  const updateUtility = async (id: string, updates: Partial<Utility>) => {
    try {
      setLoading(true)
      await apiUpdateUtility(id, updates)
      await getUtilities()
      handleCloseEditUtility()
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
  const deleteUtility = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteUtility(id)
      await getUtilities()
      handleCloseDeleteUtility()
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
  const getUtilities = useCallback(async () => {
    try {
      setLoading(true)
      const apiParams = {
        ...filters,
        searchTerm: debounceSearchTerm
      }
      const res = await apiGetAllUtilities(apiParams)
      setUtilities(res.data || [])
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
    getUtilities()
  }, [filters, debounceSearchTerm])

  return {
    utilities,
    searchTerm,
    filters,
    totalRecords,
    totalPages,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isFilterModalOpen,
    isDeleteModalOpen,
    selectedUtility,
    formMode,
    hasActiveFilters,

    setSearchTerm,
    setFilters,
    addUtility,
    updateUtility,
    resetFilters,
    setIsViewModalOpen,
    setIsFilterModalOpen,
    handleCreateUtility,
    handleViewUtility,
    handleEditUtility,
    handleDeleteUtility,
    confirmDelete,
    handleSort,
    handleCloseDeleteUtility,
    handleCloseEditUtility,
  }
}
