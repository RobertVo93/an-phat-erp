"use client"

import {
  addEmployee as apiAddEmployee,
  deleteEmployee as apiDeleteEmployee,
  updateEmployee as apiUpdateEmployee,
} from "@/lib/httpclient/employee.client"
import type { IEmployeePageData } from "@/lib/services/employeePageService"
import type { Employee, EmployeeFilters, EmployeeSortBy } from "@/types/employee"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

const FILTER_QUERY_KEYS: Array<keyof Pick<
  EmployeeFilters,
  "status" | "employeeType" | "department" | "position" | "hireDateFrom" | "hireDateTo" | "salaryMin" | "salaryMax"
>> = [
  "status",
  "employeeType",
  "department",
  "position",
  "hireDateFrom",
  "hireDateTo",
  "salaryMin",
  "salaryMax",
]

type QueryValue = string | number | undefined

export function useEmployees(initialData: IEmployeePageData) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isMutating, setIsMutating] = useState(false)
  const [searchTerm, setSearchTerm] = useState(initialData.filters.name ?? "")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const updateUrl = (
    updates: Record<string, QueryValue>,
    options: { replace?: boolean; clearKeys?: string[] } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    options.clearKeys?.forEach((key) => params.delete(key))

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    const query = params.toString()
    const href = query ? `${pathname}?${query}` : pathname
    startTransition(() => {
      if (options.replace) {
        router.replace(href, { scroll: false })
      } else {
        router.push(href, { scroll: false })
      }
    })
  }

  useEffect(() => {
    const currentSearch = searchParams.get("name") ?? ""
    if (searchTerm === currentSearch) return

    const timeout = window.setTimeout(() => {
      updateUrl({ name: searchTerm.trim() || undefined, page: 1 }, { replace: true })
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [searchTerm, searchParams])

  const handleCreateEmployee = () => {
    setSelectedEmployee(null)
    setFormMode("create")
    setIsFormModalOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormMode("edit")
    setIsFormModalOpen(true)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteModalOpen(true)
  }

  const handleSaveEmployee = async (employeeData: Omit<Employee, "id"> | Employee) => {
    try {
      setIsMutating(true)
      if (formMode === "create") {
        await apiAddEmployee(employeeData)
      } else if (selectedEmployee?.id) {
        await apiUpdateEmployee(selectedEmployee.id, employeeData)
      }
      startTransition(() => router.refresh())
    } catch (error) {
      console.error("[useEmployees] Failed to save employee", error)
    } finally {
      setIsMutating(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedEmployee?.id) return

    try {
      setIsMutating(true)
      await apiDeleteEmployee(selectedEmployee.id)
      setIsDeleteModalOpen(false)
      setSelectedEmployee(null)
      startTransition(() => router.refresh())
    } catch (error) {
      console.error("[useEmployees] Failed to delete employee", error)
    } finally {
      setIsMutating(false)
    }
  }

  const handleSort = (field: EmployeeSortBy) => {
    updateUrl({
      sortBy: field,
      sortOrder: initialData.sortBy === field && initialData.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    })
  }

  const setCurrentPage = (page: number) => updateUrl({ page })
  const setItemsPerPage = (limit: number) => updateUrl({ limit, page: 1 })

  const setFilters = (filters: EmployeeFilters) => {
    const updates = FILTER_QUERY_KEYS.reduce<Record<string, QueryValue>>((result, key) => {
      const value = filters[key]
      result[key] = value === "all" ? undefined : value
      return result
    }, { page: 1 })

    updateUrl(updates, { clearKeys: FILTER_QUERY_KEYS })
  }

  return {
    employees: initialData.employees,
    searchTerm,
    filters: initialData.filters,
    currentPage: initialData.currentPage,
    itemsPerPage: initialData.itemsPerPage,
    sortBy: initialData.sortBy,
    sortOrder: initialData.sortOrder,
    totalPages: initialData.totalPages,
    totalEmployees: initialData.totalEmployees,
    loading: isPending || isMutating,
    isFormModalOpen,
    isDeleteModalOpen,
    isFilterModalOpen,
    formMode,
    selectedEmployee,
    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    setIsFormModalOpen,
    setIsDeleteModalOpen,
    setIsFilterModalOpen,
    handleCreateEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleSaveEmployee,
    handleConfirmDelete,
    handleSort,
  }
}
