"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useProducts } from "@/hooks/use-products"
import { ProductViewModal } from "@/components/products/product-view-modal"
import { ProductFormModal } from "@/components/products/product-form-modal"
import { ProductDeleteModal } from "@/components/products/product-delete-modal"
import { ProductFilterModal } from "@/components/products/product-filter-modal"
import { ProductListHeader } from "@/components/products/product-list-header"
import { ProductListBody } from "@/components/products/product-list-body"

export default function ProductsPage() {
  const { t } = useLanguage()
  const {
    products,
    loading,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalProducts,
    allCollections,
    hasActiveFilters,
    startIndex,
    endIndex,
    selectedProduct,
    viewModalOpen,
    formModalOpen,
    deleteModalOpen,
    filterModalOpen,

    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    getAllCollections,
    handleCreate,
    handleView,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    setFilterModalOpen,
    setViewModalOpen,
    setFormModalOpen,
    setDeleteModalOpen,
    handleDeleteConfirm,
  } = useProducts()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header Section - Mobile Optimized */}
        <ProductListHeader
          t={t}
          handleCreate={handleCreate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setFilterModalOpen={setFilterModalOpen}
          hasActiveFilters={hasActiveFilters}
          filters={filters}
        />

        <ProductListBody
          t={t}
          products={products}
          totalProducts={totalProducts}
          startIndex={startIndex}
          endIndex={endIndex}
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          setItemsPerPage={setItemsPerPage}
          handleCreate={handleCreate}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <ProductViewModal product={selectedProduct} open={viewModalOpen} onOpenChange={setViewModalOpen} />

      <ProductFormModal
        product={selectedProduct}
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        onSubmit={handleFormSubmit}
        loading={loading}
        allCollections={allCollections}
        getAllCollections={getAllCollections}
      />

      <ProductDeleteModal
        product={selectedProduct}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />

      <ProductFilterModal
        filters={filters}
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={setFilters}
        allCollections={allCollections}
        getAllCollections={getAllCollections}
      />
    </ERPLayout>
  )
}
