"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  Building,
  UserX,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEmployees } from "@/hooks/use-employees"
import { useLanguage } from "@/contexts/language-context"
import { EmployeeFormModal } from "@/components/employees/employee-form-modal"
import { EmployeeViewModal } from "@/components/employees/employee-view-modal"
import { EmployeeDeleteModal } from "@/components/employees/employee-delete-modal"
import { EmployeeFilterModal } from "@/components/employees/employee-filter-modal"
import type { Employee } from "@/types/employee"

export default function EmployeePage() {
  const { t } = useLanguage()
  const {
    employees,
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
  } = useEmployees()

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEmployeeTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-blue-100 text-blue-800"
      case "Part-time":
        return "bg-purple-100 text-purple-800"
      case "Contract":
        return "bg-orange-100 text-orange-800"
      case "Intern":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case "Active":
        return t("employees.status.active")
      case "Inactive":
        return t("employees.status.inactive")
      case "On Leave":
        return t("employees.status.onLeave")
      default:
        return status
    }
  }

  const translateEmployeeType = (type: string) => {
    switch (type) {
      case "Full-time":
        return t("employees.type.fullTime")
      case "Part-time":
        return t("employees.type.partTime")
      case "Contract":
        return t("employees.type.contract")
      case "Intern":
        return t("employees.type.intern")
      default:
        return type
    }
  }

  const translateDepartment = (department: string) => {
    switch (department) {
      case "IT":
        return t("employees.departments.it")
      case "Marketing":
        return t("employees.departments.marketing")
      case "Finance":
        return t("employees.departments.finance")
      case "Sales":
        return t("employees.departments.sales")
      case "HR":
        return t("employees.departments.hr")
      case "Operations":
        return t("employees.departments.operations")
      default:
        return department
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
      updateEmployee(selectedEmployee.id, employeeData)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id)
      setIsDeleteModalOpen(false)
      setSelectedEmployee(null)
    }
  }

  const handleSort = (field: keyof Employee) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalEmployees)

  return (
    <ERPLayout>
      <div className="space-y-4 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("employees.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("employees.description")}</p>
          </div>
          <Button onClick={handleCreateEmployee} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("employees.addEmployee")}
          </Button>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.totalEmployees")}</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.registeredEmployees")}</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.activeEmployees")}</CardTitle>
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{stats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.currentlyActive")}</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.departments")}</CardTitle>
              <Building className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{stats.departments}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.totalDepartments")}</p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.onLeave")}</CardTitle>
              <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-lg sm:text-2xl font-bold">{stats.onLeave}</div>
              <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.employeesOnLeave")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter - Mobile Optimized */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("employees.searchPlaceholder")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            {t("employees.filter")}
          </Button>
        </div>

        {/* Sort Controls - Mobile */}
        <div className="flex flex-wrap gap-2 sm:hidden">
          <Select value={sortBy} onValueChange={(value) => handleSort(value as keyof Employee)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t("employees.form.name")}</SelectItem>
              <SelectItem value="position">{t("employees.position")}</SelectItem>
              <SelectItem value="department">{t("employees.department")}</SelectItem>
              <SelectItem value="salary">{t("employees.salary")}</SelectItem>
              <SelectItem value="status">{t("employees.form.status")}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        {/* Employee Cards - Mobile First */}
        <div className="space-y-3">
          {employees.map((employee) => (
            <Card key={employee.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-base truncate">{employee.name}</h3>
                    <Badge className={getStatusColor(employee.status)} variant="secondary">
                      {translateStatus(employee.status)}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Building className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {employee.position} - {translateDepartment(employee.department)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span>{employee.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <Badge variant="outline" className={getEmployeeTypeColor(employee.employeeType)}>
                        {translateEmployeeType(employee.employeeType)}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{employee.salary}</span>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("employees.view")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t("employees.edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteEmployee(employee)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("employees.delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}

          {employees.length === 0 && (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{t("employees.noEmployeesFound")}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Pagination - Mobile Optimized */}
        <Card className="p-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              {t("employees.pagination.showing")} {startIndex}-{endIndex} {t("employees.pagination.of")}{" "}
              {totalEmployees} {t("employees.pagination.employees")}
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-muted-foreground">{t("employees.pagination.itemsPerPage")}</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number.parseInt(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNumber: number
                    if (totalPages <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage <= 2) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 1) {
                      pageNumber = totalPages - 2 + i
                    } else {
                      pageNumber = currentPage - 1 + i
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        mode={formMode}
      />

      <EmployeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
      />

      <EmployeeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        employee={selectedEmployee}
      />

      <EmployeeFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ERPLayout>
  )
}
