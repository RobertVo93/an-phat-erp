"use client"

import { useState, useMemo, useEffect } from "react"
import type { PayrollRecord, PayrollFilters, PayrollStats, PayrollCalculation, SortableKey } from "@/types/payroll"
import { PayrollStatus } from "@/types"
import { getallPayrolls as apiGetAllPayrolls, processOnePayroll as apiProcessOnePayroll, processPayrolls as apiProcessPayrolls } from "@/lib/httpclient/payroll.client"

export function usePayroll() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<PayrollFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<SortableKey>("employee.name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState<boolean>(false)
  const [filterPeriods, setFilterPeriods] = useState<string[]>([])

  // Filter and search payroll records
  const filteredRecords = useMemo(() => {
    const filtered = payrollRecords.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || record.status === filters.status
      const matchesDepartment = !filters.department || record.employee?.department === filters.department
      const matchesPosition =
        !filters.position || record.employee?.position?.toLowerCase().includes(filters.position.toLowerCase())
      const matchesPayPeriod = !filters.payPeriod || record.payPeriod === filters.payPeriod

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesPosition &&
        matchesPayPeriod
      )
    })

    // Sort records
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "employee.name":
          aValue = a.employee?.name || "";
          bValue = b.employee?.name || "";
          break;

        case "employee.department":
          aValue = a.employee?.department || "";
          bValue = b.employee?.department || "";
          break;

        case "totalSalary":
          aValue = a.totalSalary ?? 0;
          bValue = b.totalSalary ?? 0;
          break;

        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;

        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered
  }, [payrollRecords, searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalRecords = filteredRecords.length
  const totalPages = Math.ceil(totalRecords / itemsPerPage)
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Statistics
  const stats: PayrollStats = useMemo(() => {
    const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.totalSalary!, 0)
    const processedCount = payrollRecords.filter((record) => record.status === PayrollStatus.processed).length
    const pendingCount = payrollRecords.filter((record) => record.status === PayrollStatus.pending).length
    const averageSalary = totalPayroll / payrollRecords.length

    return {
      totalPayroll,
      processedCount,
      pendingCount,
      averageSalary,
    }
  }, [payrollRecords])

  // Calculate payroll for an employee
  const calculatePayroll = (calculation: PayrollCalculation): number => {
    const dailySalary = calculation.baseSalary / 30
    const workingSalary = dailySalary * calculation.workingDays
    const overtimePay = calculation.overtimeHours * calculation.overtimeRate
    const grossSalary = workingSalary + overtimePay + calculation.bonus
    const taxDeduction = grossSalary * calculation.taxRate
    const insuranceDeduction = grossSalary * calculation.insuranceRate
    const netSalary = grossSalary - taxDeduction - insuranceDeduction

    return Math.round(netSalary)
  }

  // Process all pending payrolls
  const processAllPayrolls = async () => {
    try {
      setLoading(true)
      const updated = await apiProcessPayrolls()
      setPayrollRecords(updated)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // CRUD operations
  // change status for 1 item
  const processOnePayroll = async (id: string) => {
    try {
      setLoading(true)
      const updated = await apiProcessOnePayroll(id)
      setPayrollRecords((prev) => prev.map(payroll => payroll.id === id ? updated : payroll))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getAllPayrolls = async () => {
    try {
      setLoading(true)
      const res = await apiGetAllPayrolls()
      setPayrollRecords(res.data)
      const allRecords = res.data as PayrollRecord[]
      const uniquePeriods = Array.from(
        new Set(
          allRecords
            .map(r => r.payPeriod)
            .filter((p): p is string => typeof p === "string")
        )
      );
      setFilterPeriods(uniquePeriods);
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllPayrolls()
  }, [])

  return {
    payrollRecords: paginatedRecords,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    totalPages,
    totalRecords,
    stats,
    calculatePayroll,
    processAllPayrolls,
    loading,
    filterPeriods,
    processOnePayroll
  }
}
