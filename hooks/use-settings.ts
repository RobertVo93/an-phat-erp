"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Setting, SettingFilters } from "@/types/setting.interface"
import {
  getSettingsClient,
  updateSettingClient,
} from "@/lib/httpclient/setting.client"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useDebounceSearchTerm } from "@/lib/utils.client"

export type SettingSortField = "configType" | "key" | "value" | "createdAt"

export function useSettings() {
  const { t } = useLanguage()
  const [settings, setSettings] = useState<Setting[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<SettingFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)

  const debounceSearchTerm = useDebounceSearchTerm(searchTerm, 500)
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some((key) => {
      if (key === "page" || key === "limit" || key === "sortBy" || key === "sortOrder") return false
      const value = filters[key as keyof SettingFilters]
      return value !== undefined && value !== ""
    })
  }, [filters])

  const getSettings = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getSettingsClient({
        ...filters,
        searchTerm: debounceSearchTerm,
      })
      setSettings(res.data || [])
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
  }, [filters, debounceSearchTerm, t])

  useEffect(() => {
    getSettings()
  }, [getSettings])

  const handleSort = (field: SettingSortField) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }))
  }

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    })
    setSearchTerm("")
  }

  const handleEditSetting = (setting: Setting) => {
    setSelectedSetting(setting)
    setIsFormModalOpen(true)
  }

  const handleViewSetting = (setting: Setting) => {
    setSelectedSetting(setting)
    setIsViewModalOpen(true)
  }

  const handleCloseForm = () => {
    setSelectedSetting(null)
    setIsFormModalOpen(false)
  }

  const updateSetting = async (id: string, updates: Partial<Setting>) => {
    try {
      setLoading(true)
      await updateSettingClient(id, updates)
      await getSettings()
      handleCloseForm()
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

  return {
    settings,
    searchTerm,
    filters,
    totalRecords,
    totalPages,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isFilterModalOpen,
    selectedSetting,
    hasActiveFilters,
    setSearchTerm,
    setFilters,
    setIsViewModalOpen,
    setIsFilterModalOpen,
    handleViewSetting,
    handleEditSetting,
    handleCloseForm,
    updateSetting,
    handleSort,
    resetFilters,
  }
}
