"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  Loader2,
} from "lucide-react"
import { useEmployees } from "@/hooks/use-employees"
import { useLanguage } from "@/contexts/language-context"
import { EmployeeFormModal } from "@/components/employees/employee-form-modal"
import { EmployeeViewModal } from "@/components/employees/employee-view-modal"
import { EmployeeDeleteModal } from "@/components/employees/employee-delete-modal"
import { EmployeeFilterModal } from "@/components/employees/employee-filter-modal"
import type { Employee } from "@/types/employee"
import { EmployeeListBody } from "@/components/employees/employee-list-body"
import { EmployeeListWebview } from "@/components/employees/employee-list-webview"

export default function EmployeePage() {
  const { t } = useLanguage()
  const {
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
  } = useEmployees()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
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
        {/* <EmployeeListHighlight 
          t={t} 
          totalEmployees={stats.totalEmployees}
          activeEmployees={stats.activeEmployees}
          departments={stats.departments}
          onLeave={stats.onLeave}
        /> */}

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

          <div className="flex flex-row space-x-2">
            <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              {t("employees.filter")}
            </Button>

            <div className="flex items-center justify-center space-x-2">
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
                <SelectContent >
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
        <div className="lg:hidden">
          <EmployeeListBody
            employees={employees}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            handleViewEmployee={handleViewEmployee}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </div>

        <div className="lg:block hidden">
          <EmployeeListWebview
            filters={filters}
            loading={loading}
            employees={employees}
            totalEmployees={totalEmployees}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            handleSort={handleSort}
            setCurrentPage={setCurrentPage}
            handleViewEmployee={handleViewEmployee}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </div>
      </div>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee!}
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
