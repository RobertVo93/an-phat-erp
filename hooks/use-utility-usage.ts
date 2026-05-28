"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import {
  addUtilityUsage,
  deleteUtilityUsage,
  getUtilityUsagesByFilter,
  updateUtilityUsage,
} from "@/lib/httpclient/utility-usage.client"
import { getUtilitiesByFilterClient } from "@/lib/httpclient/utility.client"
import { getUsers } from "@/lib/httpclient"
import { MutationMode } from "@/types/base.interface"
import { UtilityStatus, UtilityUsageStatus } from "@/types/enums"
import type { IUtilityUsage, IUtilityUsageFilters, IUser, Utility } from "@/types"

export function useUtilityUsage() {
  const { t } = useLanguage()
  const today = new Date()

  const [records, setRecords] = useState<IUtilityUsage[]>([])
  const [utilities, setUtilities] = useState<Utility[]>([])
  const [approvers, setApprovers] = useState<IUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<IUtilityUsageFilters>({
    page: 1,
    limit: 10,
    sortBy: "usageTime",
    sortOrder: "desc",
    periodStart: today,
    periodEnd: today,
  })
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [loading, setLoading] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<IUtilityUsage | null>(null)
  const [formMode, setFormMode] = useState<MutationMode>("create")

  const debounceSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  const handleSort = (field: string) => {
    setFilters((prev) => {
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortBy: field,
          sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
          page: 1,
        }
      }
      return { ...prev, sortBy: field, sortOrder: "asc", page: 1 }
    })
  }

  const handleCreate = () => {
    setFormMode("create")
    setSelectedRecord(null)
    setIsFormModalOpen(true)
  }

  const handleEdit = (record: IUtilityUsage) => {
    setFormMode("update")
    setSelectedRecord(record)
    setIsFormModalOpen(true)
  }

  const handleDelete = (record: IUtilityUsage) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setSelectedRecord(null)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedRecord(null)
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getUtilityUsagesByFilter({
        ...filters,
        searchTerm: debounceSearchTerm || undefined,
      })

      setRecords(response.data || [])
      setTotalRecords(response.total || 0)
      setTotalPages(Math.ceil((response.total || 0) / (filters.limit || 10)))
    } catch (error) {
      console.error(error)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, debounceSearchTerm, t])

  const fetchReferences = useCallback(async () => {
    try {
      setLoading(true)
      const [utilityResponse, userResponse] = await Promise.all([
        getUtilitiesByFilterClient({ page: 1, limit: 1000, status: UtilityStatus.active }),
        getUsers(1, 1000, "username", "asc"),
      ])

      setUtilities(utilityResponse.data || [])
      setApprovers(userResponse.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReferences()
  }, [fetchReferences])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const submitCreate = async (payload: Omit<IUtilityUsage, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      await addUtilityUsage(payload)
      await fetchData()
      closeFormModal()
      toast({ title: t("common.success"), description: t("utilityUsage.success.created") })
    } catch (error) {
      console.error(error)
      toast({ title: t("common.error.title"), description: t("common.error.cannotAdd"), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const submitUpdate = async (id: string, payload: Partial<IUtilityUsage>) => {
    try {
      setLoading(true)
      await updateUtilityUsage(id, payload)
      await fetchData()
      closeFormModal()
      toast({ title: t("common.success"), description: t("utilityUsage.success.updated") })
    } catch (error) {
      console.error(error)
      toast({ title: t("common.error.title"), description: t("common.error.cannotUpdate"), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedRecord?.id) return
    try {
      setLoading(true)
      await deleteUtilityUsage(selectedRecord.id)
      await fetchData()
      closeDeleteModal()
      toast({ title: t("common.success"), description: t("utilityUsage.success.deleted") })
    } catch (error) {
      console.error(error)
      toast({ title: t("common.error.title"), description: t("common.error.cannotDelete"), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return {
    records,
    utilities,
    approvers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    totalRecords,
    totalPages,
    loading,
    isFormModalOpen,
    isDeleteModalOpen,
    selectedRecord,
    formMode,
    statusOptions: Object.values(UtilityUsageStatus),

    handleSort,
    handleCreate,
    handleEdit,
    handleDelete,
    closeFormModal,
    closeDeleteModal,
    submitCreate,
    submitUpdate,
    confirmDelete,
  }
}
