"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useStockChange } from "@/hooks/use-stock-change"
import { StockChangeFormModal } from "@/components/stock-change/stock-change-form-modal"
import { StockChangeViewModal } from "@/components/stock-change/stock-change-view-modal"
import { StockChangeFilterModal } from "@/components/stock-change/stock-change-filter-modal"
import { StockChangeDeleteModal } from "@/components/stock-change/stock-change-delete-modal"
import { StockChangeHeader } from "@/components/stock-change/StockChangeHeader"
import { StockChangeFilterBar } from "@/components/stock-change/StockChangeFilterBar"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { formatDate } from "@/lib/utils.date"
import { StockEmptyState } from "@/components/stock-change/StockEmptyState"
import { formatCurrency } from "@/lib/utils.currency"
import { Badge } from "@/components/ui/badge"
import { getStockChangeStatusColor } from "@/lib/utils.style"
import { StockChangeList } from "@/components/stock-change/StockChangeList"
import { StockChangeCompleteModal } from "@/components/stock-change/stock-change-complete-modal"
import { StockChangeActions } from "@/components/stock-change/stock-change-actions"
import type { IStockChangePageData } from "@/lib/services/stockChangePageService"
import type { StockChange } from "@/types"
import Link from "next/link"
import { ADMIN_ROUTES } from "@/constants"

interface IStockChangePageClientProps {
  initialData: IStockChangePageData
}

type StockChangeTableRow = StockChange & { id: string }

export function StockChangePageClient({ initialData }: IStockChangePageClientProps) {
  const { t } = useLanguage()
  const {
    stockChangeRecords,
    searchTerm,
    filters,
    total,
    pageSize,
    sortBy,
    sortOrder,
    currentPage,
    totalPages,
    loading,
    products,
    warehouses,
    showFormModal,
    showViewModal,
    showFilterModal,
    showDeleteModal,
    showAutoCompleteModal,
    selectedStockChange,
    editingStockChange,
    setSearchTerm,
    handleFiltersChange,
    setShowFormModal,
    setShowViewModal,
    setShowFilterModal,
    setShowDeleteModal,
    setShowAutoCompeleteModal,
    setEditingStockChange,
    handleSort,
    handleView,
    handleEdit,
    handleDelete,
    handleAutoComplete,
    handleSave,
    handleDeleteConfirm,
    handlePageChange,
  } = useStockChange(initialData)

  const tableRows = stockChangeRecords.filter((record): record is StockChangeTableRow => Boolean(record.id))

  const columns: ServersideTableColumn<StockChangeTableRow>[] = [
    {
      key: "number",
      title: t("stockIn.number"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <Link
            href={ADMIN_ROUTES.stockChangeDetail(row.id)}
            className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline"
          >
            {row.number}
          </Link>
          <p className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("stockIn.status"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          {row.status && (
            <Badge className={getStockChangeStatusColor(row.status)}>{t(`stockIn.status.${row.status}`)}</Badge>
          )}
        </div>
      ),
    },
    {
      key: "supplier",
      title: t("stockIn.supplier"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.supplier}</p>
        </div>
      ),
    },
    {
      key: "totalAmount",
      title: t("stockIn.totalAmount"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{formatCurrency(row.totalAmount || 0)}</p>
        </div>
      ),
    },
    {
      key: "warehouse",
      title: t("stockIn.warehouse"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.warehouse?.name}</p>
        </div>
      ),
    },
    {
      key: "receivedBy",
      title: t("stockIn.receivedBy"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.receivedBy}</p>
        </div>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (row) => (
        <StockChangeActions
          stockChange={row}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAutoComplete={handleAutoComplete}
        />
      ),
    },
  ]

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <StockChangeHeader onNewStockIn={() => setShowFormModal(true)} />
        <StockChangeFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onShowFilter={() => setShowFilterModal(true)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t("stockIn.stockInSheet")}</CardTitle>
          </CardHeader>
          <CardContent>
            {stockChangeRecords.length === 0 ? (
              <StockEmptyState onNewOrderClick={() => setShowFormModal(true)} />
            ) : (
              <>
                <div className="hidden lg:block">
                  <ServersideTable
                    columns={columns}
                    data={tableRows}
                    total={total}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onPageChange={handlePageChange}
                    onSort={handleSort}
                    loading={loading}
                    totalPages={totalPages}
                  />
                </div>

                <div className="lg:hidden">
                  <StockChangeList
                    records={stockChangeRecords}
                    total={total}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    handleAutoComplete={handleAutoComplete}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StockChangeFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingStockChange(null)
        }}
        onSave={handleSave}
        stockChange={editingStockChange!}
        products={products}
        warehouses={warehouses}
        loading={loading}
      />
      <StockChangeViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        stockChange={selectedStockChange}
      />
      <StockChangeFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFiltersChange}
        currentFilters={filters}
        warehouses={warehouses}
      />
      <StockChangeDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        stockChange={selectedStockChange}
      />
      <StockChangeCompleteModal
        isOpen={showAutoCompleteModal}
        loading={loading}
        onClose={() => {
          setShowAutoCompeleteModal(false)
          setEditingStockChange(null)
        }}
        onSave={handleSave}
        stockChange={editingStockChange!}
      />
    </>
  )
}
