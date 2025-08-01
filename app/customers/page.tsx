"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Search,
  Filter,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { useCustomers } from "@/hooks/use-customers"
import { CustomerFormModal } from "@/components/customers/customer-form-modal"
import { CustomerViewModal } from "@/components/customers/customer-view-modal"
import { CustomerDeleteModal } from "@/components/customers/customer-delete-modal"
import { CustomerFilterModal } from "@/components/customers/customer-filter-modal"
// import { CustomerListHighlight } from "@/components/customers/customer-list-highlight"
import { CustomerListBody } from "@/components/customers/customer-list-body"


export default function CustomersPage() {
  const { t } = useLanguage()
  const {
    customers,
    // allCustomers,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCustomers,
    loading,
    // totalRevenue,
    startIndex,
    endIndex,
    selectedCustomer,
    formMode,
    isFilterModalOpen,
    isFormModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,

    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    getVisiblePages,
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

  } = useCustomers()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-4 md:space-y-6">
        {/* Header Section - Responsive */}
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

        {/* Search and Filter - Responsive */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("customers.searchPlaceholder")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            <span className="md:hidden">{t("customers.filter")}</span>
            <span className="hidden md:inline">{t("customers.filter")}</span>
          </Button>
        </div>

        {/* Statistics Cards - Mobile 2x2 Grid */}
        {/* <CustomerListHighlight
          t={t}
          allCustomers={allCustomers}
          totalRevenue={totalRevenue}
        /> */}

        {/* Main Content Card */}
        <CustomerListBody
          t={t}
          customers={customers}
          totalCustomers={totalCustomers}
          startIndex={startIndex}
          endIndex={endIndex}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          getVisiblePages={getVisiblePages}
          handleViewCustomer={handleViewCustomer}
          handleEditCustomer={handleEditCustomer}
          handleDeleteCustomer={handleDeleteCustomer}
        />
      </div>

      {/* Modals */}
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
    </ERPLayout>
  )
}
