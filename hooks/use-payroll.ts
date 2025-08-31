"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { PayrollRecord, PayrollFilters, PayrollStats, PayrollSortableKey } from "@/types/payroll"
import { PayrollStatus } from "@/types"
import { 
  getAllPayrollsClient, 
  approvePayrollClient,
  syncPayrollClient, 
  deletePayrollClient 
} from "@/lib/httpclient/payroll.client"
import { useLanguage } from "@/contexts/language-context"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { toast } from "@/components/ui/use-toast"
import { formatMonthYear } from "@/lib/utils"

export function usePayroll() {
  const { t } = useLanguage()
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [selectedPayPeriod, setSelectedPayPeriod] = useState<Date>(new Date())
  const [filters, setFilters] = useState<PayrollFilters>({
    page: 1,
    limit: 10,
    sortBy: "workingShifts",
    sortOrder: "desc",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [totalRecords, setTotalRecords] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  const debouncedSearchTerm = useDebounceSearchTerm(searchTerm || "", 500)
  const totalPages = useMemo(() => Math.ceil(totalRecords / (filters.limit || 1)), [totalRecords, filters.limit])
  const stats: PayrollStats = useMemo(() => {
    return {
      totalPayroll: payrollRecords.reduce((sum, record) => sum + (record.totalSalary || 0), 0),
      processedCount: payrollRecords.filter((record) => record.status === PayrollStatus.processed).length,
      pendingCount: payrollRecords.filter((record) => record.status !== PayrollStatus.processed).length,
      averageSalary: payrollRecords.length > 0 ? payrollRecords.reduce((sum, record) => sum + (record.totalSalary || 0), 0) / payrollRecords.length : 0,
    }
  }, [payrollRecords])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllPayrollsClient({
        ...filters,
        searchTerm: debouncedSearchTerm,
        payPeriod: formatMonthYear(selectedPayPeriod),
      })
      setPayrollRecords(response.data)
      setTotalRecords(response.total)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error"),
        description: t("common.error.cannotLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, debouncedSearchTerm, selectedPayPeriod])

  useEffect(() => {
    loadData()
  }, [filters, debouncedSearchTerm, selectedPayPeriod])

  const handleSort = (field: PayrollSortableKey): void => {
    if (filters.sortBy === field) {
      setFilters({ ...filters, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc", page: 1 });
    } else {
      setFilters({ ...filters, sortBy: field, sortOrder: "desc", page: 1 });
    }
  };

  // Open the modals
  const handleView = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsViewModalOpen(true)
  }
  const onApprovePayroll = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsApproveModalOpen(true)
  }
  const onDeleteClickHandler = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }

  // Handle the actions to interact with the server
  const handleExport = () => {
    // TODO: implement export
    alert(t("payroll.messages.exportSuccess"))
  }
  const onApprovePayrollConfirm = async () => {
    try {
      setLoading(true)
      if (selectedRecord) {
        await approvePayrollClient(selectedRecord.id!)
        await loadData()
      }
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error"),
        description: t("common.error.cannotApprove"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const handleConfirmDelete = async () => {
    try {
      setLoading(true)
      if (selectedRecord) {
        await deletePayrollClient(selectedRecord.id!)
        await loadData()
      }
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error"),
        description: t("common.error.cannotDelete"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const handleSyncPayroll = async (selectedPeriod: Date) => {
    try {
      setLoading(true)
      await syncPayrollClient(selectedPeriod)
      await loadData()
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error"),
        description: t("common.error.cannotSync"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    searchTerm,
    payrollRecords,
    filters,
    totalRecords,
    stats,
    totalPages,
    loading,
    isViewModalOpen,
    isApproveModalOpen,
    selectedRecord,
    isDeleteModalOpen,
    selectedPayPeriod,

    setSelectedPayPeriod,
    setSearchTerm,
    setFilters,
    setIsViewModalOpen,
    setIsApproveModalOpen,
    setIsDeleteModalOpen,
    onApprovePayrollConfirm,
    handleView,
    onApprovePayroll,
    handleExport,
    handleSort,
    handleSyncPayroll,
    handleConfirmDelete,
    onDeleteClickHandler,
  }
}
