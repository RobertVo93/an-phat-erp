"use client"

import { ERPLayout } from "@/components/erp-layout"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useUtilityUsage } from "@/hooks/use-utility-usage"
import { UtilityUsageHeader } from "@/components/utility-usage/utility-usage-header"
import { UtilityUsageSearchFilterBar } from "@/components/utility-usage/utility-usage-search-filter-bar"
import { UtilityUsageServersideTable } from "@/components/utility-usage/utility-usage-serverside-table"
import { UtilityUsageFormModal } from "@/components/utility-usage/utility-usage-form-modal"
import { UtilityUsageDeleteModal } from "@/components/utility-usage/utility-usage-delete-modal"

export default function UtilityUsagePage() {
  const { t } = useLanguage()
  const {
    records,
    utilities,
    approvers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    totalRecords,
    totalPages,
    loading,
    isFormModalOpen,
    isDeleteModalOpen,
    selectedRecord,
    formMode,

    handleSort,
    handleCreate,
    handleEdit,
    handleDelete,
    closeFormModal,
    closeDeleteModal,
    submitCreate,
    submitUpdate,
    confirmDelete,
  } = useUtilityUsage()

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <UtilityUsageHeader onCreate={handleCreate} />

        <UtilityUsageSearchFilterBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          filters={filters}
          onChangeFilters={setFilters}
        />

        <div className="hidden md:block">
          <UtilityUsageServersideTable
            data={records}
            total={totalRecords}
            currentPage={filters.page || 1}
            pageSize={filters.limit || 10}
            sortBy={filters.sortBy || "usageTime"}
            sortOrder={filters.sortOrder || "desc"}
            loading={loading}
            totalPages={totalPages}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="md:hidden">
          <Card>
            <CardHeader>
              <CardTitle>{t("utilityUsage.mobileList")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {records.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("common.noData")}</p>
              ) : (
                records.map((record) => (
                  <div key={record.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{record.number}</p>
                      <p className="text-xs text-muted-foreground">{record.totalUsage ?? 0} {record.unit}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{record.utility?.name}</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <button className="text-xs font-medium text-slate-700" onClick={() => handleEdit(record)}>{t("common.edit")}</button>
                      <button className="text-xs font-medium text-red-600" onClick={() => handleDelete(record)}>{t("common.delete")}</button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <UtilityUsageFormModal
          isOpen={isFormModalOpen}
          mode={formMode}
          record={selectedRecord}
          utilities={utilities}
          approvers={approvers}
          loading={loading}
          onClose={closeFormModal}
          onSave={submitCreate}
          onUpdate={submitUpdate}
        />

        <UtilityUsageDeleteModal
          isOpen={isDeleteModalOpen}
          loading={loading}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          record={selectedRecord}
        />
      </div>
    </ERPLayout>
  )
}
