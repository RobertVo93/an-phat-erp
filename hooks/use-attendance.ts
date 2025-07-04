"use client"

import { useState, useMemo, useEffect } from "react"
import type { AttendanceRecord, AttendanceFilters, AttendanceStats, TimesheetData } from "@/types/attendance"
import { getEmployee } from "@/lib/httpclient/employee.client"
import { AttendanceStatus, Employee } from "@/types"
import { getAllAttendanceRecords, addAttendanceRecord as apiAddAttendanceRecord, updateAttendanceRecord as apiUpdateAttendanceRecord, deleteAttendanceRecord as apiDeleteAttendanceRecord } from "@/lib/httpclient/attendance.client"

export function useAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<AttendanceFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof AttendanceRecord>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<"list" | "timesheet">("list")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Filter and search attendance records
  const filteredRecords = useMemo(() => {
    const filtered = attendanceRecords.filter((record) => {
      const matchesSearch =
        searchTerm === "" ||
        record.employee?.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee?.id!.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEmployeeName =
        !filters.employeeName || record.employee?.name!.toLowerCase().includes(filters.employeeName.toLowerCase())

      const matchesDate = !filters.date || new Date(record.date!).toDateString() === filters.date.toDateString();
      const matchesStatus = !filters.status || record.status === filters.status
      const matchesShift = !filters.shift || record.shift === filters.shift
      const matchesEmployeeId = !filters.employeeId || record.employee?.id! === filters.employeeId

      return (
        matchesSearch &&
        matchesEmployeeName &&
        matchesDate &&
        matchesStatus &&
        matchesShift &&
        matchesEmployeeId
      )
    })

    // Sort records
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (
        typeof aValue === "object" &&
        typeof bValue === "object" &&
        aValue !== null &&
        bValue !== null &&
        "name" in aValue &&
        "name" in bValue
      ) {
        const aName = (aValue as any).name
        const bName = (bValue as any).name

        if (typeof aName === "string" && typeof bName === "string") {
          const comparison = aName.localeCompare(bName)
          return sortOrder === "asc" ? comparison : -comparison
        }
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === "asc" ? comparison : -comparison
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }

      if (aValue! < bValue!) return sortOrder === "asc" ? -1 : 1
      if (aValue! > bValue!) return sortOrder === "asc" ? 1 : -1
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
    const totalPresent = filteredRecords.filter((record) => record.status === AttendanceStatus.present).length
    const totalAbsent = filteredRecords.filter((record) => record.status === AttendanceStatus.absent).length
    const totalLate = filteredRecords.filter((record) => record.status === AttendanceStatus.late).length
    const totalOvertimeHours = filteredRecords.reduce((sum, record) => sum + record.overtimeHours!, 0)
    const totalWages = filteredRecords.reduce((sum, record) => sum + record.dailyWage!, 0)

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
    const filteredByMonth = filteredRecords.filter((record) => {
      if (!record.date) return false;
      const date = new Date(record.date);
      return (
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const employees = new Map<string, TimesheetData>();

    filteredByMonth.forEach((record) => {
      if (!record.employee?.id) return;

      if (!employees.has(record.employee.id)) {
        employees.set(record.employee.id, {
          employeeId: record.employee.id,
          employeeName: record.employee.name!,
          shifts: {
            morning: {},
            afternoon: {},
            evening: {},
          },
          totalDays: 0,
        });
      }

      const employee = employees.get(record.employee.id)!;
      const day = new Date(record.date!).getDate().toString();
      employee.shifts[record.shift!][day] = record;

      const allShifts = Object.values(employee.shifts).flatMap((shift) =>
        Object.values(shift)
      );
      employee.totalDays = allShifts.filter(
        (record) => record && record.status === AttendanceStatus.present
      ).length;
    });

    return Array.from(employees.values());
  }, [filteredRecords, currentMonth, currentYear]);

  // CRUD operations
  const addAttendanceRecord = async (recordData: Omit<AttendanceRecord, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      const newRecord: AttendanceRecord = {
        ...recordData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const added = await apiAddAttendanceRecord(newRecord)
      setAttendanceRecords((prev) => [...prev, added])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateAttendanceRecord = async (id: string, recordData: Partial<AttendanceRecord>) => {
    try {
      setLoading(true)
      const updated = await apiUpdateAttendanceRecord(id, recordData)
      setAttendanceRecords((prev) => prev.map(record => record.id === id ? updated : record))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteAttendanceRecord = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteAttendanceRecord(id)
      setAttendanceRecords((prev) => prev.filter((record) => record.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getAttendanceRecord = (id: string) => {
    return attendanceRecords.find((record) => record.id === id)
  }

  const onInit = async () => {
    try {
      setLoading(true)
      const employeeData = await getEmployee()
      setEmployees(employeeData.data)
      const attendanceData = await getAllAttendanceRecords()
      setAttendanceRecords(attendanceData.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onInit()
  }, [])

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
    loading,
    currentMonth, setCurrentMonth, currentYear, setCurrentYear
  }
}
