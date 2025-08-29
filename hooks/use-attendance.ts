"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import type { AttendanceRecord, AttendanceFilters, TimesheetData, AttendanceViewMode } from "@/types/attendance"
import { getEmployee } from "@/lib/httpclient/employee.client"
import { AttendanceShift, AttendanceStatus, Employee, EmployeeStatus } from "@/types"
import { 
  getAllAttendanceRecords,
  addAttendanceRecord as apiAddAttendanceRecord,
  updateAttendanceRecord as apiUpdateAttendanceRecord,
  deleteAttendanceRecord as apiDeleteAttendanceRecord
} from "@/lib/httpclient/attendance.client"
import { MutationMode } from "@/types/base.interface"
import { useDebounceSearchTerm } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"

export function useAttendance() {
  const { t } = useLanguage()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<AttendanceFilters>({
    limit: 10,
    page: 1,
    sortBy: "date",
    sortOrder: "desc",
  })
  const [viewMode, setViewMode] = useState<AttendanceViewMode>("list")
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [formMode, setFormMode] = useState<MutationMode>("create")
  const [totalRecords, setTotalRecords] = useState(0)
  const totalPages = useMemo(() => Math.ceil(totalRecords / (filters.limit || 1)), [totalRecords, filters.limit])
  const debouncedSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  // Timesheet data
  const timesheetData = useMemo(() => {
    const filteredByMonth = attendanceRecords.filter((record) => {
      if (!record.date) return false;
      const date = new Date(record.date);
      return (
        date.getMonth() + 1 === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    const employees = new Map<string, TimesheetData>();

    // init all "active" employees
    activeEmployees.forEach((emp) => {
      employees.set(emp.id!, {
        employeeId: emp.id!,
        employeeName: emp.name!,
        shifts: {
          morning: {},
          afternoon: {},
          evening: {},
          all: {},
        },
        totalDays: 0,
      });
    });

    // attendance sheet
    filteredByMonth.forEach((record) => {
      if (!record.employee?.id) return;

      const employee = employees.get(record.employee.id);
      if (!employee) return;

      const day = new Date(record.date!).getDate().toString();
      employee.shifts[record.shift!][day] = record;

      const allShifts = Object.values(employee.shifts).flatMap((shift) =>
        Object.values(shift)
      );
      employee.totalDays = allShifts.filter(
        (record) => record && record.status === AttendanceStatus.completed
      ).length;
    });

    return Array.from(employees.values());
  }, [attendanceRecords, currentMonth, currentYear]);

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
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotAdd"),
        variant: "destructive",
      })
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
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotUpdate"),
        variant: "destructive",
      })
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
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotDelete"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: string) => {
    if (filters.sortBy === field) {
      setFilters({ ...filters, page: 1, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })
    } else {
      setFilters({ ...filters, page: 1, sortBy: field as keyof AttendanceRecord, sortOrder: "desc" })
    }
  }

  // Modal handlers
  const handleAddRecord = () => {
    setFormMode("create")
    setSelectedRecord(null)
    setIsFormModalOpen(true)
  }
  const handleEditRecord = (record: AttendanceRecord) => {
    setFormMode("update")
    setSelectedRecord(record)
    setIsFormModalOpen(true)
  }
  const handleViewRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsViewModalOpen(true)
  }
  const handleDeleteRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }
  const handleCellClick = (record: AttendanceRecord | null, employeeData: TimesheetData, shift: AttendanceShift, day: number) => {
    if (record) {
      setFormMode("update")
      setSelectedRecord(record)
      setIsFormModalOpen(true)
    }
    else {
      setFormMode("create")
      setSelectedRecord({
        employee: { id: employeeData.employeeId, name: employeeData.employeeName },
        date: new Date(currentYear, currentMonth - 1, day),
        shift: shift,
        status: AttendanceStatus.draft,
        checkIn: new Date(currentYear, currentMonth - 1, day),
        checkOut: new Date(currentYear, currentMonth - 1, day),
        notes: "",
        workHours: 0,
      })
      setIsFormModalOpen(true)
    }
  }
  const handleResetFilters = () => setFilters({})
  const handleExport = () => { /* TODO: implement export */ }

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getAllAttendanceRecords({
        dateFrom: new Date(currentYear, currentMonth - 1, 1).toISOString(),
        dateTo: new Date(currentYear, currentMonth, 0).toISOString(),
        searchTerm: debouncedSearchTerm,
        employeeId: filters.employeeId,
        status: filters.status,
        shift: filters.shift,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      setAttendanceRecords(response.data)
      setTotalRecords(response.total)
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
  }, [currentMonth, currentYear, debouncedSearchTerm, filters])

  useEffect(() => {
    loadData()
  }, [currentMonth, currentYear, debouncedSearchTerm, filters, loadData])

  useEffect(() => {
    const onInit = async () => {
      try {
        setLoading(true)
        const response = await Promise.all([
          getEmployee({ status: EmployeeStatus.active, page: 1, limit: 1000 }),
          loadData()
        ])
        setActiveEmployees(response[0].data as Employee[])
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
    }
    onInit()
  }, [])

  useEffect(() => {
    if (viewMode === "timesheet") {
      setFilters({
        limit: 1000,
        page: 1,
        sortBy: "date",
        sortOrder: "desc",
        dateFrom: new Date(currentYear, currentMonth - 1, 1).toISOString(),
        dateTo: new Date(currentYear, currentMonth, 0).toISOString(),
      })
    }
  }, [viewMode])

  return {
    attendanceRecords,
    searchTerm,
    filters,
    viewMode,
    totalPages,
    totalRecords,
    timesheetData,
    activeEmployees,
    loading,
    currentMonth,
    currentYear,
    isFormModalOpen,
    isViewModalOpen,
    isFilterModalOpen,
    isDeleteModalOpen,
    selectedRecord,
    formMode,

    handleSort,
    setSearchTerm,
    setFilters,
    setViewMode,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    setCurrentMonth,
    setCurrentYear,
    handleAddRecord,
    handleEditRecord,
    handleViewRecord,
    handleDeleteRecord,
    handleResetFilters,
    handleExport,
    setIsFilterModalOpen,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    handleCellClick,
  }
}
