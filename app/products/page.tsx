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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

        <Card>
          <CardHeader className="pb-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg sm:text-xl">{t("products.catalog")}</CardTitle>
                  <CardDescription className="text-sm">
                    {totalProducts} {t("products.items")}
                  </CardDescription>
                </div>

                {/* Mobile-friendly pagination controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                  <span className="text-muted-foreground whitespace-nowrap">
                    {startIndex}-{endIndex} / {totalProducts}
                  </span>
                  <div className="flex items-center gap-2">
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-xs">/ {t("products.page")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductListBody
              products={products}
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              total={totalProducts}
              loading={loading}
              setCurrentPage={setCurrentPage}
              handleCreate={handleCreate}
              handleView={handleView}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </CardContent>
        </Card>
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
      />
    </ERPLayout>
  )
}
