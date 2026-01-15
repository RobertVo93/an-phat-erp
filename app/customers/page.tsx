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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CustomerListBody } from "@/components/customers/customer-list-body"
import CustomerListWebview from "@/components/customers/customer-list-webview"


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
    handleSort
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

          <div className="flex flex-row space-x-2">
            <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span className="md:hidden">{t("customers.filter")}</span>
              <span className="hidden md:inline">{t("customers.filter")}</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
              >
                <SelectTrigger className="w-16 md:w-20">
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
          </div>
        </div>

        {/* Main Content Card */}
        <div className="lg:hidden">
          <CustomerListBody
            customers={customers}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            getVisiblePages={getVisiblePages}
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
