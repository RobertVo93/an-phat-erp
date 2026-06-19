"use client"

import { Button } from "@/components/ui/button"
import {
  Plus,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useCustomers } from "@/hooks/use-customers"
import { CustomerFormModal } from "@/components/customers/customer-form-modal"
import { CustomerViewModal } from "@/components/customers/customer-view-modal"
import { CustomerDeleteModal } from "@/components/customers/customer-delete-modal"
import { CustomerFilterModal } from "@/components/customers/customer-filter-modal"
import { CustomerListBody } from "@/components/customers/customer-list-body"
import CustomerListWebview from "@/components/customers/customer-list-webview"
import type { ICustomerPageData } from "@/lib/services/customerPageService"
import { CustomerListFilterBar } from "@/components/customers/customer-list-filter-bar"
import type { CustomerSortBy } from "@/types/customer"

interface ICustomersPageClientProps {
  initialData: ICustomerPageData
}

export function CustomersPageClient({ initialData }: ICustomersPageClientProps) {
  const { t } = useLanguage()
  const {
    customers,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCustomers,
    loading,
    selectedCustomer,
    formMode,
    isFilterModalOpen,
    isFormModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,

    setSearchTerm,
    setFilters,
    setCurrentPage,
    handleCreateCustomer,
    handleViewCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
    setIsFilterModalOpen,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    handleSaveCustomer,
    handleConfirmDelete,
    handleSort,
  } = useCustomers(initialData)

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("customers.title")}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t("customers.description")}</p>
          </div>
          <Button onClick={handleCreateCustomer} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:hidden">{t("customers.addCustomer")}</span>
            <span className="hidden md:inline">{t("customers.addCustomer")}</span>
          </Button>
        </div>

        <CustomerListFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onShowFilter={() => setIsFilterModalOpen(true)}
          sortBy={(filters.sortBy || "createdAt") as CustomerSortBy}
          sortOrder={filters.sortOrder || "desc"}
          onSort={handleSort}
        />

        <div className="lg:hidden">
          <CustomerListBody
            customers={customers}
            totalPages={totalPages}
            totalCustomers={totalCustomers}
            currentPage={currentPage}
            pageSize={itemsPerPage}
            setCurrentPage={setCurrentPage}
            handleViewCustomer={handleViewCustomer}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        </div>

        <div className="hidden lg:block">
          <CustomerListWebview
            customers={customers}
            totalCustomers={totalCustomers}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            currentPage={currentPage}
            filters={filters}
            loading={loading}
            setCurrentPage={setCurrentPage}
            handleViewCustomer={handleViewCustomer}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
            handleSort={handleSort}
          />
        </div>
      </div>

      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer!}
        mode={formMode}
      />

      <CustomerViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        customer={selectedCustomer}
      />

      <CustomerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        customer={selectedCustomer}
      />

      <CustomerFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </>
  )
}
