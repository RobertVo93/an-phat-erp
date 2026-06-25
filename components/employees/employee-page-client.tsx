"use client"

import { EmployeeDeleteModal } from "@/components/employees/employee-delete-modal"
import { EmployeeFilterBar } from "@/components/employees/employee-filter-bar"
import { EmployeeFilterModal } from "@/components/employees/employee-filter-modal"
import { EmployeeFormModal } from "@/components/employees/employee-form-modal"
import { EmployeeListBody } from "@/components/employees/employee-list-body"
import { EmployeeListWebview } from "@/components/employees/employee-list-webview"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useEmployees } from "@/hooks/use-employees"
import type { IEmployeePageData } from "@/lib/services/employeePageService"
import { Loader2, Plus } from "lucide-react"

interface IEmployeePageClientProps {
  initialData: IEmployeePageData
}

export function EmployeePageClient({ initialData }: IEmployeePageClientProps) {
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
  } = useEmployees(initialData)

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("employees.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("employees.description")}</p>
          </div>
          <Button onClick={handleCreateEmployee} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("employees.addEmployee")}
          </Button>
        </div>

        <EmployeeFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onShowFilter={() => setIsFilterModalOpen(true)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        <div className="lg:hidden">
          <EmployeeListBody
            employees={employees}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={itemsPerPage}
            totalEmployees={totalEmployees}
            setCurrentPage={setCurrentPage}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </div>

        <div className="hidden lg:block">
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
            setItemsPerPage={setItemsPerPage}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </div>
      </div>

      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmployee ?? undefined}
        mode={formMode}
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
    </>
  )
}
