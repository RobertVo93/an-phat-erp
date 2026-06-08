"use client"

import { ERPLayout } from "@/components/erp-layout"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ServersidePagination } from "@/components/common/table/ServersidePagination"
import { SettingFilterModal } from "@/components/settings/setting-filter-modal"
import { SettingFormModal } from "@/components/settings/setting-form-modal"
import { SettingHeader } from "@/components/settings/setting-header"
import { SettingListMobileView } from "@/components/settings/setting-list-mobileview"
import { SettingSearchFilterBar } from "@/components/settings/setting-search-filter-bar"
import { SettingTable } from "@/components/settings/setting-table"
import { SettingViewModal } from "@/components/settings/setting-view-modal"
import { useSettings, type SettingSortField } from "@/hooks/use-settings"

export default function SettingPage() {
  const {
    settings,
    searchTerm,
    filters,
    totalRecords,
    totalPages,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isFilterModalOpen,
    selectedSetting,
    hasActiveFilters,
    setSearchTerm,
    setFilters,
    setIsViewModalOpen,
    setIsFilterModalOpen,
    handleViewSetting,
    handleEditSetting,
    handleCloseForm,
    updateSetting,
    handleSort,
    resetFilters,
  } = useSettings()

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <SettingHeader />
        <SettingSearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          hasActiveFilters={hasActiveFilters}
          onOpenFilter={() => setIsFilterModalOpen(true)}
          onReset={resetFilters}
        />

        <div className="hidden md:block">
          <SettingTable
            data={settings}
            total={totalRecords}
            currentPage={filters.page || 1}
            pageSize={filters.limit || 10}
            sortBy={filters.sortBy || "createdAt"}
            sortOrder={filters.sortOrder || "desc"}
            loading={loading}
            totalPages={totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onSort={(field) => handleSort(field as SettingSortField)}
            onView={handleViewSetting}
            onEdit={handleEditSetting}
          />
        </div>

        <div className="block md:hidden">
          <div className="space-y-4">
            <SettingListMobileView
              settings={settings}
              onView={handleViewSetting}
              onEdit={handleEditSetting}
            />
            <ServersidePagination
              total={totalRecords}
              currentPage={filters.page || 1}
              pageSize={filters.limit || 10}
              onPageChange={(page) => setFilters({ ...filters, page })}
              totalPages={totalPages}
            />
          </div>
        </div>

        <SettingFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseForm}
          onUpdate={updateSetting}
          setting={selectedSetting}
        />
        <SettingViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          setting={selectedSetting}
        />
        <SettingFilterModal
          isOpen={isFilterModalOpen}
          currentFilters={filters}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={setFilters}
        />
      </div>
    </ERPLayout>
  )
}
