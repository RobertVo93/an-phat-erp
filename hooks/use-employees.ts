"use client"

import { useState, useMemo, useEffect } from "react"
import type { Employee, EmployeeFilters, EmployeeStats } from "@/types/employee"
import { EmployeeStatus } from "@/types"
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

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        searchTerm === "" ||
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.includes(searchTerm) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || employee.status === filters.status
      const matchesEmployeeType = !filters.employeeType || employee.employeeType === filters.employeeType
      const matchesDepartment = !filters.department || employee.department === filters.department
      const matchesPosition =
        !filters.position || employee.position?.toLowerCase().includes(filters.position.toLowerCase())

      const matchesHireDateFrom = !filters.hireDateFrom || new Date(employee.hireDate!) >= new Date(filters.hireDateFrom)
      const matchesHireDateTo = !filters.hireDateTo || new Date(employee.hireDate!) <= new Date(filters.hireDateTo)

      const salaryValue = Number.parseFloat(employee.salary!.toString().replace(/[$,]/g, ""))
      const matchesSalaryMin = !filters.salaryMin || salaryValue >= filters.salaryMin
      const matchesSalaryMax = !filters.salaryMax || salaryValue <= filters.salaryMax

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEmployeeType &&
        matchesDepartment &&
        matchesPosition &&
        matchesHireDateFrom &&
        matchesHireDateTo &&
        matchesSalaryMin &&
        matchesSalaryMax
      )
    })

    // Sort employees
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue)
        return sortOrder === "asc" ? comparison : -comparison
      }

      if (aValue! < bValue!) return sortOrder === "asc" ? -1 : 1
      if (aValue! > bValue!) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [employees, searchTerm, filters, sortBy, sortOrder])

  // Pagination
  const totalEmployees = filteredEmployees.length
  const totalPages = Math.ceil(totalEmployees / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  const getEmployee = async () => {
    try {
      setLoading(true)
      const data = await apiGetEmployee()
      setEmployees(data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEmployee()
  }, [])

  return {
    employees: paginatedEmployees,
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
    totalEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    stats,
    loading
  }
}
