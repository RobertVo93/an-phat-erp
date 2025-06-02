"use client"

import { useState, useMemo } from "react"
import type { Employee, EmployeeFilters, EmployeeStats } from "@/types/employee"

// Mock data for demonstration
const mockEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "Robert Vo",
    email: "robert.vo@anphat.com",
    phone: "+84 123 456 789",
    position: "Manager",
    department: "IT",
    salary: "$5,000",
    hireDate: "2020-01-15",
    employeeType: "Full-time",
    status: "Active",
    address: "123 Nguyen Hue, District 1, Ho Chi Minh City",
    emergencyContact: "+84 987 654 321",
    notes: "Team lead for development projects",
  },
  {
    id: "EMP-002",
    name: "Nguyen Van A",
    email: "nguyen.a@anphat.com",
    phone: "+84 234 567 890",
    position: "Developer",
    department: "IT",
    salary: "$3,500",
    hireDate: "2021-03-20",
    employeeType: "Full-time",
    status: "Active",
    address: "456 Le Loi, District 3, Ho Chi Minh City",
    emergencyContact: "+84 876 543 210",
    notes: "Frontend specialist",
  },
  {
    id: "EMP-003",
    name: "Tran Thi B",
    email: "tran.b@anphat.com",
    phone: "+84 345 678 901",
    position: "Designer",
    department: "Marketing",
    salary: "$3,000",
    hireDate: "2021-06-10",
    employeeType: "Full-time",
    status: "Active",
    address: "789 Dong Khoi, District 1, Ho Chi Minh City",
    emergencyContact: "+84 765 432 109",
    notes: "UI/UX design expert",
  },
  {
    id: "EMP-004",
    name: "Le Van C",
    email: "le.c@anphat.com",
    phone: "+84 456 789 012",
    position: "Accountant",
    department: "Finance",
    salary: "$2,800",
    hireDate: "2022-01-05",
    employeeType: "Full-time",
    status: "On Leave",
    address: "321 Hai Ba Trung, District 1, Ho Chi Minh City",
    emergencyContact: "+84 654 321 098",
    notes: "Currently on maternity leave",
  },
  {
    id: "EMP-005",
    name: "Pham Thi D",
    email: "pham.d@anphat.com",
    phone: "+84 567 890 123",
    position: "Sales Representative",
    department: "Sales",
    salary: "$2,500",
    hireDate: "2022-08-15",
    employeeType: "Part-time",
    status: "Active",
    address: "654 Nguyen Trai, District 5, Ho Chi Minh City",
    emergencyContact: "+84 543 210 987",
    notes: "Part-time sales support",
  },
  {
    id: "EMP-006",
    name: "Hoang Van E",
    email: "hoang.e@anphat.com",
    phone: "+84 678 901 234",
    position: "Intern",
    department: "HR",
    salary: "$800",
    hireDate: "2023-06-01",
    employeeType: "Intern",
    status: "Active",
    address: "987 Cach Mang Thang 8, District 3, Ho Chi Minh City",
    emergencyContact: "+84 432 109 876",
    notes: "Summer internship program",
  },
]

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<EmployeeFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Employee>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Filter and search employees
  const filteredEmployees = useMemo(() => {
    const filtered = employees.filter((employee) => {
      const matchesSearch =
        searchTerm === "" ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = !filters.status || employee.status === filters.status
      const matchesEmployeeType = !filters.employeeType || employee.employeeType === filters.employeeType
      const matchesDepartment = !filters.department || employee.department === filters.department
      const matchesPosition =
        !filters.position || employee.position.toLowerCase().includes(filters.position.toLowerCase())

      const matchesHireDateFrom = !filters.hireDateFrom || employee.hireDate >= filters.hireDateFrom
      const matchesHireDateTo = !filters.hireDateTo || employee.hireDate <= filters.hireDateTo

      const salaryValue = Number.parseFloat(employee.salary.replace(/[$,]/g, ""))
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

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
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
    const activeEmployees = employees.filter((emp) => emp.status === "Active").length
    const departments = new Set(employees.map((emp) => emp.department)).size
    const onLeave = employees.filter((emp) => emp.status === "On Leave").length

    return {
      totalEmployees,
      activeEmployees,
      departments,
      onLeave,
    }
  }, [employees])

  // CRUD operations
  const addEmployee = (employeeData: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
    }
    setEmployees((prev) => [...prev, newEmployee])
  }

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...employeeData } : emp)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

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
  }
}
