"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUtilities } from "@/hooks/use-utilities"
import { UtilityFormModal } from "@/components/utilities/utility-form-modal"
import { UtilityViewModal } from "@/components/utilities/utility-view-modal"
import { UtilityFilterModal } from "@/components/utilities/utility-filter-modal"
import { UtilityDeleteModal } from "@/components/utilities/utility-delete-modal"
import { UtilityHeader } from "@/components/utilities/UtilityHeader"
import { UtilitySearchFilterBar } from "@/components/utilities/UtilitySearchFilterBar"
import { UtilitySortControls } from "@/components/utilities/UtilitySortControls"
import { UtilityList } from "@/components/utilities/UtilityList"
import { UtilityPagination } from "@/components/utilities/UtilityPagination"
import { UtilityServersideTable } from "@/components/utilities/UtilityServersideTable"
import { useLanguage } from "@/contexts/language-context"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"

export default function UtilityPage() {
  const { t } = useLanguage()
  const {
    utilities,
    searchTerm,
    filters,
    totalRecords,
    totalPages,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isFilterModalOpen,
    isDeleteModalOpen,
    selectedUtility,
    formMode,
    hasActiveFilters,

    setSearchTerm,
    setFilters,
    addUtility,
    updateUtility,
    resetFilters,
    setIsViewModalOpen,
    setIsFilterModalOpen,
    handleCreateUtility,
    handleViewUtility,
    handleEditUtility,
    handleDeleteUtility,
    confirmDelete,
    handleSort,
    handleCloseDeleteUtility,
    handleCloseEditUtility,
  } = useUtilities()

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <UtilityHeader onAdd={handleCreateUtility} />
        <UtilitySearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          hasActiveFilters={hasActiveFilters}
          onOpenFilter={() => setIsFilterModalOpen(true)}
          onReset={resetFilters}
        />
        {/* Desktop View - ServersideTable */}
        <div className="hidden md:block">
          <UtilityServersideTable
            data={utilities}
            total={totalRecords}
            currentPage={filters.page || 1}
            pageSize={filters.limit || 10}
            sortBy={filters.sortBy || "number"}
            sortOrder={filters.sortOrder || "asc"}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onSort={(field) => handleSort(field as any)}
            loading={loading}
            totalPages={totalPages}
            onView={handleViewUtility}
            onEdit={handleEditUtility}
            onDelete={handleDeleteUtility}
          />
        </div>

        {/* Mobile View - List and Pagination */}
        <div className="block md:hidden">
          <UtilitySortControls
            sortField={filters.sortBy as any || "number"}
            sortDirection={filters.sortOrder || "asc"}
            onChangeField={(field) => handleSort(field as any)}
            onToggleDirection={() => handleSort(filters.sortBy as any)}
          />
          <Card className="my-4">
            <CardHeader>
              <CardTitle>{t("utilities.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <UtilityList
                utilities={utilities}
                onView={handleViewUtility}
                onEdit={handleEditUtility}
                onDelete={handleDeleteUtility}
              />
            </CardContent>
          </Card>
          <UtilityPagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            itemsPerPage={filters.limit || 10}
            setCurrentPage={(page) => setFilters({ ...filters, page })}
            setItemsPerPage={(limit) => setFilters({ ...filters, limit, page: 1 })}
          />
        </div>

        {/* Modals */}
        <UtilityFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseEditUtility}
          onSave={addUtility}
          onUpdate={updateUtility}
          utility={selectedUtility!}
          mode={formMode}
        />
        <UtilityViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          utility={selectedUtility}
        />
        <UtilityFilterModal
          isOpen={isFilterModalOpen}
          currentFilters={filters}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={setFilters}
        />
        <UtilityDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteUtility}
          onConfirm={confirmDelete}
          utility={selectedUtility}
        />
      </div>
    </ERPLayout>
  )
}
