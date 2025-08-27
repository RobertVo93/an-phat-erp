"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useStockChange } from "@/hooks/use-stock-change"
import { StockChangeFormModal } from "@/components/stock-change/stock-change-form-modal"
import { StockChangeViewModal } from "@/components/stock-change/stock-change-view-modal"
import { StockChangeFilterModal } from "@/components/stock-change/stock-change-filter-modal"
import { StockChangeDeleteModal } from "@/components/stock-change/stock-change-delete-modal"
import { StockChangeStatus } from "@/types"
// import { StockChangeStatistics } from "@/components/stock-change/StockChangeStatistics";
import { StockChangeList } from "@/components/stock-change/StockChangeList";
import { StockChangePagination } from "@/components/stock-change/StockChangePagination";
import { StockChangeHeader } from "@/components/stock-change/StockChangeHeader";
import { StockChangeFilterBar } from "@/components/stock-change/StockChangeFilterBar";
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { Toaster } from "@/components/ui/toaster"

export default function StockChangePage() {
  const { t } = useLanguage();
  const {
    stockChangeRecords,
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
    totalPages,
    loading,
    products,
    warehouses,
    showFormModal,
    showViewModal,
    showFilterModal,
    showDeleteModal,
    selectedStockChange,
    editingStockChange,
    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    setShowFormModal,
    setShowViewModal,
    setShowFilterModal,
    setShowDeleteModal,
    setEditingStockChange,
    handleSort,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleDeleteConfirm,
  } = useStockChange();

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
            <StockChangeList
              records={stockChangeRecords}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              StockChangeStatus={StockChangeStatus}
            />
            {totalPages > 1 && (
              <StockChangePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            )}
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
        onApply={setFilters}
        currentFilters={filters}
        warehouses={warehouses}
      />
      <StockChangeDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        stockChange={selectedStockChange}
      />
      <Toaster />
    </ERPLayout>
  );
}
