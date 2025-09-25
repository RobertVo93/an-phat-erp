"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useStockChange } from "@/hooks/use-stock-change"
import { StockChangeFormModal } from "@/components/stock-change/stock-change-form-modal"
import { StockChangeViewModal } from "@/components/stock-change/stock-change-view-modal"
import { StockChangeFilterModal } from "@/components/stock-change/stock-change-filter-modal"
import { StockChangeDeleteModal } from "@/components/stock-change/stock-change-delete-modal"
import { StockChangeHeader } from "@/components/stock-change/StockChangeHeader";
import { StockChangeFilterBar } from "@/components/stock-change/StockChangeFilterBar";
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { formatDate } from "@/lib/utils.date"
import { StockEmptyState } from "@/components/stock-change/StockEmptyState"
import { formatCurrency } from "@/lib/utils.currency"
import { Badge } from "@/components/ui/badge"
import { getStockChangeStatusColor } from "@/lib/utils.style"
import { Button } from "@/components/ui/button"
import { StockChangeStatus } from "@/types"
import { StockChangeList } from "@/components/stock-change/StockChangeList"
import { StockChangeCompleteModal } from "@/components/stock-change/stock-change-complete-modal"

export default function StockChangePage() {
  const { t } = useLanguage();
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
  } = useStockChange();

  // Define columns for ServersideTable
  const columns: ServersideTableColumn<any>[] = [
    {
      key: "number",
      title: t("stockIn.number"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.number}</p>
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
          <Badge className={getStockChangeStatusColor(row.status)} >{t(`stockIn.status.${row.status}`)}</Badge>
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
          <p className="text-sm font-medium">{formatCurrency(row.totalAmount)}</p>
        </div>
      ),
    },
    {
      key: "warehouse",
      title: t("stockIn.warehouse"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.warehouse.name}</p>
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
        <div className="flex justify-start space-x-1">
          <Button variant="outline" size="sm" onClick={() => handleView(row)}>{t("common.view")}</Button>
          {row.status !== StockChangeStatus.completed &&
            <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>{t("common.edit")}</Button>
          }
          {row.status !== StockChangeStatus.completed &&
            <Button variant="outline" size="sm" onClick={() => handleAutoComplete(row)}>{t("stockIn.form.completeNow")}</Button>
          }
          {row.status !== StockChangeStatus.completed && (
            <Button variant="destructive" size="sm" onClick={() => handleDelete(row)}>{t("common.delete")}</Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <ERPLayout>
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
        {/* <StockChangeStatistics
          totalReceipts={allStockChangeRecords.length}
          totalValue={totalValue}
          completedRecords={completedRecords}
          pendingRecords={pendingRecords}
        /> */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stockIn.stockInSheet")}</CardTitle>
            <CardDescription>{t("stockIn.stockInSheetsList")}</CardDescription>
          </CardHeader>
          <CardContent>
            {stockChangeRecords.length === 0 ?
              <StockEmptyState onNewOrderClick={() => setShowFormModal(true)} /> :
              <>
                <div className="hidden lg:block">
                  <ServersideTable
                    columns={columns}
                    data={stockChangeRecords}
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
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    handleAutoComplete={handleAutoComplete}
                  />
                </div>
              </>

            }
          </CardContent>
        </Card>
      </div>
      <StockChangeFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingStockChange(null);
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
          setShowAutoCompeleteModal(false);
          setEditingStockChange(null);
        }}
        onSave={handleSave}
        stockChange={editingStockChange!}
      />
    </ERPLayout>
  );
}
