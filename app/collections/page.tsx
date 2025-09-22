"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { useCollections } from "@/hooks/use-collections"
import { CollectionViewModal } from "@/components/collections/collection-view-modal"
import { CollectionFormModal } from "@/components/collections/collection-form-modal"
import { CollectionDeleteModal } from "@/components/collections/collection-delete-modal"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import CollectionPageHeader from "@/components/collections/collection-page-header"
import CollectionPageStatistic from "@/components/collections/collection-page-statistic"
import CollectionListHeader from "@/components/collections/collection-list-header"
import CollectionListWebview from "@/components/collections/collection-list-webview"
import CollectionListMobileView from "@/components/collections/collection-list-mobileview"

export default function CollectionsPage() {
  const { t } = useLanguage()
  const {
    collections,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCollections,
    loading,
    startIndex,
    endIndex,
    viewModal,
    deleteModal,
    formModal,

    handleView,
    handleEdit,
    handleDelete,
    setItemsPerPage,
    setFilters,
    handleCreate,
    handleSave,
    handleConfirmDelete,
    setViewModal,
    setFormModal,
    setDeleteModal,
    handlePageChange,
    handleSort
  } = useCollections()

  const exportToCSV = () => {
    const csvContent = [
      [t("common.id"), t("common.name"), t("common.description"), t("common.category"), t("common.status"), t("common.products"), t("common.createdAt")],
      ...collections.map((col) => [
        col.id,
        col.name,
        col.description,
        t(`collections.status.${col.status!}`),
        col.products?.length,
        col.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "collections.csv"
    link.click()
  }

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-4 md:space-y-6">
        {/* Header Section - Mobile Optimized */}
        <CollectionPageHeader
          filters={filters}
          setFilters={setFilters}
          handleCreate={handleCreate}
          exportToCSV={exportToCSV}
        />

        {/* Statistics Cards - Mobile Grid */}
        <CollectionPageStatistic
          collections={collections}
          totalCollections={totalCollections}
        />

        {/* Main Content Card */}
        <Card>
          <CardHeader className="pb-4">
            <CollectionListHeader
              startIndex={startIndex}
              endIndex={endIndex}
              totalCollections={totalCollections}
              itemsPerPage={itemsPerPage}

              setItemsPerPage={setItemsPerPage}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="hidden lg:block">
                <CollectionListWebview
                  collections={collections}
                  total={totalCollections}
                  currentPage={currentPage}
                  pageSize={itemsPerPage}
                  sortBy={filters.sortBy!}
                  sortOrder={filters.sortOrder!}
                  totalPages={totalPages}
                  loading={loading}
                  handlePageChange={handlePageChange}
                  handleSort={handleSort}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </div>

              <div className="lg:hidden">
                <CollectionListMobileView
                  collections={collections}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                  handleView={handleView}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CollectionViewModal
        collection={viewModal.collection}
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ open, collection: null })}
      />

      <CollectionFormModal
        collection={formModal.collection}
        open={formModal.open}
        onOpenChange={(open) => setFormModal({ open, collection: null })}
        onSave={handleSave}
      />

      <CollectionDeleteModal
        collection={deleteModal.collection}
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ open, collection: null })}
        onConfirm={handleConfirmDelete}
      />
    </ERPLayout>
  )
}
