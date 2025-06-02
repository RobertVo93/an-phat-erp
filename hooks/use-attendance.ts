"use client"

import { useState, useMemo } from "react"
import type { AttendanceRecord, AttendanceFilters, AttendanceStats, TimesheetData } from "@/types/attendance"

// Mock data for demonstration
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT-001",
    employeeId: "EMP-001",
    employeeName: "Robert Vo",
    date: "2025-01-15",
    checkIn: "08:30",
    checkOut: "17:45",
    shift: "Morning",
    status: "Present",
    workHours: 8.25,
    overtimeHours: 1.25,
    dailyWage: 150,
    notes: "Good performance",
    createdAt: "2025-01-15T08:30:00Z",
    updatedAt: "2025-01-15T17:45:00Z",
  },
  {
    id: "ATT-002",
    employeeId: "EMP-002",
    employeeName: "Nguyen Van A",
    date: "2025-01-15",
    checkIn: "08:45",
    checkOut: "17:30",
    shift: "Morning",
    status: "Late",
    workHours: 7.75,
    overtimeHours: 0,
    dailyWage: 120,
    notes: "Late arrival",
    createdAt: "2025-01-15T08:45:00Z",
    updatedAt: "2025-01-15T17:30:00Z",
  },
  {
    id: "ATT-003",
    employeeId: "EMP-003",
    employeeName: "Tran Thi B",
    date: "2025-01-15",
    checkIn: "14:00",
    checkOut: "22:00",
    shift: "Afternoon",
    status: "Present",
    workHours: 8,
    overtimeHours: 0,
    dailyWage: 130,
    createdAt: "2025-01-15T14:00:00Z",
    updatedAt: "2025-01-15T22:00:00Z",
  },
  {
    id: "ATT-004",
    employeeId: "EMP-004",
    employeeName: "Le Van C",
    date: "2025-01-15",
    shift: "Morning",
    status: "Absent",
    workHours: 0,
    overtimeHours: 0,
    dailyWage: 0,
    notes: "Sick leave",
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "ATT-005",
    employeeId: "EMP-001",
    employeeName: "Robert Vo",
    date: "2025-01-16",
    checkIn: "08:00",
    checkOut: "16:30",
    shift: "Morning",
    status: "Present",
    workHours: 8.5,
    overtimeHours: 0.5,
    dailyWage: 155,
    createdAt: "2025-01-16T08:00:00Z",
    updatedAt: "2025-01-16T16:30:00Z",
  },
]

// Mock employees data (normally from database)
const mockEmployees = [
  { id: "EMP-001", name: "Robert Vo", department: "IT", position: "Developer" },
  { id: "EMP-002", name: "Nguyen Van A", department: "IT", position: "Tester" },
  { id: "EMP-003", name: "Tran Thi B", department: "Marketing", position: "Manager" },
  { id: "EMP-004", name: "Le Van C", department: "Finance", position: "Accountant" },
  { id: "EMP-005", name: "Pham Thi D", department: "HR", position: "HR Manager" },
  { id: "EMP-006", name: "Hoang Van E", department: "IT", position: "Senior Developer" },
  { id: "EMP-007", name: "Vu Thi F", department: "Sales", position: "Sales Executive" },
  { id: "EMP-008", name: "Do Van G", department: "Operations", position: "Supervisor" },
]

export function useAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<AttendanceFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof AttendanceRecord>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"list" | "timesheet">("list")
  const [employees] = useState(mockEmployees)

  // Filter and search attendance records
  const filteredRecords = useMemo(() => {
    const filtered = attendanceRecords.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEmployeeName =
        !filters.employeeName || record.employeeName.toLowerCase().includes(filters.employeeName.toLowerCase())

      const matchesDateFrom = !filters.dateFrom || record.date >= filters.dateFrom
      const matchesDateTo = !filters.dateTo || record.date <= filters.dateTo
      const matchesStatus = !filters.status || record.status === filters.status
      const matchesShift = !filters.shift || record.shift === filters.shift
      const matchesEmployeeId = !filters.employeeId || record.employeeId === filters.employeeId

      return (
        matchesSearch &&
        matchesEmployeeName &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesStatus &&
        matchesShift &&
        matchesEmployeeId
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

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [attendanceRecords, searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalRecords = filteredRecords.length
  const totalPages = Math.ceil(totalRecords / itemsPerPage)
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Statistics
  const stats: AttendanceStats = useMemo(() => {
    const totalPresent = filteredRecords.filter((record) => record.status === "Present").length
    const totalAbsent = filteredRecords.filter((record) => record.status === "Absent").length
    const totalLate = filteredRecords.filter((record) => record.status === "Late").length
    const totalOvertimeHours = filteredRecords.reduce((sum, record) => sum + record.overtimeHours, 0)
    const totalWages = filteredRecords.reduce((sum, record) => sum + record.dailyWage, 0)

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      totalOvertimeHours,
      totalWages,
    }
  }, [filteredRecords])

  // Timesheet data
  const timesheetData = useMemo(() => {
    const employees = new Map<string, TimesheetData>()

    filteredRecords.forEach((record) => {
      if (!employees.has(record.employeeId)) {
        employees.set(record.employeeId, {
          employeeId: record.employeeId,
          employeeName: record.employeeName,
          shifts: {
            Morning: {},
            Afternoon: {},
            Evening: {},
          },
          totalDays: 0,
        })
      }

      const employee = employees.get(record.employeeId)!
      const day = new Date(record.date).getDate().toString()
      employee.shifts[record.shift][day] = record

      // Calculate total days
      const allShifts = Object.values(employee.shifts).flatMap((shift) => Object.values(shift))
      employee.totalDays = allShifts.filter((record) => record && record.status === "Present").length
    })

    return Array.from(employees.values())
  }, [filteredRecords])

  // CRUD operations
  const addAttendanceRecord = (recordData: Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt">) => {
    const newRecord: AttendanceRecord = {
      ...recordData,
      id: `ATT-${String(attendanceRecords.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setAttendanceRecords((prev) => [...prev, newRecord])
  }

  const updateAttendanceRecord = (id: string, recordData: Partial<AttendanceRecord>) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? {
              ...record,
              ...recordData,
              updatedAt: new Date().toISOString(),
            }
          : record,
      ),
    )
  }

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const getAttendanceRecord = (id: string) => {
    return attendanceRecords.find((record) => record.id === id)
  }

  return {
    attendanceRecords: paginatedRecords,
    allRecords: attendanceRecords,
    filteredRecords,
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
    viewMode,
    setViewMode,
    totalPages,
    totalRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getAttendanceRecord,
    stats,
    timesheetData,
    employees,
    getEmployeeById: (id: string) => employees.find((emp) => emp.id === id),
  }
}
