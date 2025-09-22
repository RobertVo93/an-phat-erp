"use client"

import { debounce } from "lodash"
import { useState, useMemo, useEffect } from "react"
import type { Employee, EmployeeFilters, EmployeeStats } from "@/types/employee"
import { EmployeeStatus, EmployeeType } from "@/types"
import { getEmployee as apiGetEmployee, addEmployee as apiAddEmployee, updateEmployee as apiUpdateEmployee, deleteEmployee as apiDeleteEmployee } from "@/lib/httpclient/employee.client"

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<EmployeeFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Employee>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [totalEmployees, setTotalEmployees] = useState(0)

  const reloadEmployees = async () => {
    setLoading(true)
    try {
      const res = await apiGetEmployee({
        name: searchTerm,
        status: filters.status as EmployeeStatus,
        employeeType: filters.employeeType as EmployeeType,
        department: filters.department as string,
        position: filters.position as string,
        hireDateFrom: filters.hireDateFrom as string,
        hireDateTo: filters.hireDateTo as string,
        salaryMin: filters.salaryMin as number,
        salaryMax: filters.salaryMax as number,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      })

      setEmployees(res.data)
      setTotalEmployees(res.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debouncedFetchProducts = debounce(async () => {
      setCurrentPage(1)
      reloadEmployees()
    }, 1000)

    debouncedFetchProducts()

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchProducts.cancel()
    }
  }, [searchTerm])

  useEffect(() => {
    reloadEmployees()
  }, [currentPage, itemsPerPage, filters])
  
  // CRUD operations
  const addEmployee = async (employeeData: Omit<Employee, "id">) => {
    try {
      setLoading(true)
      const added = await apiAddEmployee(employeeData)
      setEmployees((prev) => [...prev, added])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    try {
      setLoading(true)
      const updated = await apiUpdateEmployee(id, employeeData)
      setEmployees((prev) => prev.map((emp) => emp.id === id ? updated : emp))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteEmployee(id)
      setEmployees((prev) => prev.filter((emp) => emp.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewModalOpen(true)
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDeleteModalOpen(true)
  }

  const handleSaveEmployee = (employeeData: Omit<Employee, "id"> | Employee) => {
    if (formMode === "create") {
      addEmployee(employeeData as Omit<Employee, "id">)
    } else if (formMode === "edit" && selectedEmployee) {
      updateEmployee(selectedEmployee.id!, employeeData)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id!)
      setIsDeleteModalOpen(false)
      setSelectedEmployee(null)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field as keyof Employee)
      setSortOrder("asc")
    }
  }

  // Statistics
  const stats: EmployeeStats = useMemo(() => {
    const totalEmployees = employees.length
    const activeEmployees = employees.filter((emp) => emp.status === EmployeeStatus.active).length
    const departments = new Set(employees.map((emp) => emp.department)).size
    const onLeave = employees.filter((emp) => emp.status === EmployeeStatus.onLeave).length

    return {
      totalEmployees,
      activeEmployees,
      departments,
      onLeave,
    }
  }, [employees])
  // Pagination
  const totalPages = useMemo(() => Math.ceil(totalEmployees / itemsPerPage), [totalEmployees, itemsPerPage])
  
  return {
    employees,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    totalPages,
    totalEmployees,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,
    isFilterModalOpen,
    formMode,
    selectedEmployee,
    
    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    setSortOrder,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    setIsFilterModalOpen,
    handleCreateEmployee,
    handleEditEmployee,
    handleViewEmployee,
    handleDeleteEmployee,
    handleSaveEmployee,
    handleConfirmDelete,
    handleSort,
  }
}
