"use client"

import { useState, useMemo } from "react"
import type { PayrollRecord, PayrollFilters, PayrollStats, PayrollCalculation } from "@/types/payroll"

// Mock data for demonstration
const mockPayrollRecords: PayrollRecord[] = [
  {
    id: "PAY-001",
    employeeId: "EMP-001",
    name: "Robert Vo",
    department: "IT",
    position: "Manager",
    baseSalary: 5000,
    overtime: 250,
    bonus: 500,
    deductions: 150,
    netSalary: 5600,
    status: "Processed",
    payPeriod: "January 2024",
    workingDays: 22,
    overtimeHours: 10,
    processedDate: "2024-01-31",
    notes: "Performance bonus included",
  },
  {
    id: "PAY-002",
    employeeId: "EMP-002",
    name: "Nguyen Van A",
    department: "IT",
    position: "Developer",
    baseSalary: 3500,
    overtime: 180,
    bonus: 200,
    deductions: 105,
    netSalary: 3775,
    status: "Processed",
    payPeriod: "January 2024",
    workingDays: 22,
    overtimeHours: 8,
    processedDate: "2024-01-31",
  },
  {
    id: "PAY-003",
    employeeId: "EMP-003",
    name: "Tran Thi B",
    department: "Marketing",
    position: "Designer",
    baseSalary: 3000,
    overtime: 120,
    bonus: 150,
    deductions: 90,
    netSalary: 3180,
    status: "Pending",
    payPeriod: "January 2024",
    workingDays: 20,
    overtimeHours: 6,
  },
  {
    id: "PAY-004",
    employeeId: "EMP-004",
    name: "Le Van C",
    department: "Finance",
    position: "Accountant",
    baseSalary: 3200,
    overtime: 0,
    bonus: 100,
    deductions: 96,
    netSalary: 3204,
    status: "Processed",
    payPeriod: "January 2024",
    workingDays: 22,
    overtimeHours: 0,
    processedDate: "2024-01-31",
  },
  {
    id: "PAY-005",
    employeeId: "EMP-005",
    name: "Pham Thi D",
    department: "HR",
    position: "HR Specialist",
    baseSalary: 2800,
    overtime: 80,
    bonus: 120,
    deductions: 84,
    netSalary: 2916,
    status: "Pending",
    payPeriod: "January 2024",
    workingDays: 21,
    overtimeHours: 4,
  },
  {
    id: "PAY-006",
    employeeId: "EMP-006",
    name: "Hoang Van E",
    department: "Sales",
    position: "Sales Representative",
    baseSalary: 2500,
    overtime: 100,
    bonus: 300,
    deductions: 75,
    netSalary: 2825,
    status: "Failed",
    payPeriod: "January 2024",
    workingDays: 22,
    overtimeHours: 5,
    notes: "Bank account verification needed",
  },
]

export function usePayroll() {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<PayrollFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof PayrollRecord>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filter and search payroll records
  const filteredRecords = useMemo(() => {
    const filtered = payrollRecords.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.position.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || record.status === filters.status
      const matchesDepartment = !filters.department || record.department === filters.department
      const matchesPosition =
        !filters.position || record.position.toLowerCase().includes(filters.position.toLowerCase())
      const matchesPayPeriod = !filters.payPeriod || record.payPeriod === filters.payPeriod

      const matchesSalaryMin = !filters.salaryMin || record.netSalary >= filters.salaryMin
      const matchesSalaryMax = !filters.salaryMax || record.netSalary <= filters.salaryMax

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesPosition &&
        matchesPayPeriod &&
        matchesSalaryMin &&
        matchesSalaryMax
      )
    })

    // Sort records
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === "asc" ? comparison : -comparison
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [payrollRecords, searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalRecords = filteredRecords.length
  const totalPages = Math.ceil(totalRecords / itemsPerPage)
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Statistics
  const stats: PayrollStats = useMemo(() => {
    const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0)
    const processedCount = payrollRecords.filter((record) => record.status === "Processed").length
    const pendingCount = payrollRecords.filter((record) => record.status === "Pending").length
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
  const processAllPayrolls = () => {
    setPayrollRecords((prev) =>
      prev.map((record) =>
        record.status === "Pending"
          ? {
              ...record,
              status: "Processed" as const,
              processedDate: new Date().toISOString().split("T")[0],
            }
          : record,
      ),
    )
  }

  // CRUD operations
  const addPayrollRecord = (recordData: Omit<PayrollRecord, "id">) => {
    const newRecord: PayrollRecord = {
      ...recordData,
      id: `PAY-${String(payrollRecords.length + 1).padStart(3, "0")}`,
    }
    setPayrollRecords((prev) => [...prev, newRecord])
  }

  const updatePayrollRecord = (id: string, recordData: Partial<PayrollRecord>) => {
    setPayrollRecords((prev) => prev.map((record) => (record.id === id ? { ...record, ...recordData } : record)))
  }

  const deletePayrollRecord = (id: string) => {
    setPayrollRecords((prev) => prev.filter((record) => record.id !== id))
  }

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
    addPayrollRecord,
    updatePayrollRecord,
    deletePayrollRecord,
    stats,
    calculatePayroll,
    processAllPayrolls,
  }
}
