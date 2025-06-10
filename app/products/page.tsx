"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { useProducts } from "@/hooks/use-products"
import { ProductViewModal } from "@/components/products/product-view-modal"
import { ProductFormModal } from "@/components/products/product-form-modal"
import { ProductDeleteModal } from "@/components/products/product-delete-modal"
import { ProductFilterModal } from "@/components/products/product-filter-modal"
import type { Product, ProductFormData } from "@/types/product"
import { formatCurrency } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductStatus } from "@/types/enums"

export default function ProductsPage() {
  const { t } = useLanguage()
  const {
    products,
    allProducts,
    filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    allCollections,
    getAllCollections,
  } = useProducts()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case ProductStatus.active:
        return "bg-green-100 text-green-800"
      case ProductStatus.inactive:
        return "bg-gray-100 text-gray-800"
      case ProductStatus.lowStock:
        return "bg-yellow-100 text-yellow-800"
      case ProductStatus.outOfStock:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    return t(`products.status.${status}`)
  }

  const getCategoryText = (category: string) => {
    return t(`products.category.${category}`)
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setFormModalOpen(true)
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id!, data)
    } else {
      await createProduct(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id!)
    }
  }

  const hasActiveFilters = Object.keys(filters).length > 0
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalProducts)

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header Section - Mobile Optimized */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("products.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("products.description")}</p>
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              <span className="sm:hidden">{t("products.addProduct")}</span>
              <span className="hidden sm:inline">{t("products.addProduct")}</span>
            </Button>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("products.searchPlaceholder")}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFilterModalOpen(true)}
              className={`w-full sm:w-auto ${hasActiveFilters ? "border-blue-500 text-blue-600" : ""}`}
            >
              <Filter className="mr-2 h-4 w-4" />
              <span className="sm:hidden">{t("products.filter")}</span>
              <span className="hidden sm:inline">{t("products.filter")}</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

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
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t("products.noProducts")}</p>
                <Button onClick={handleCreate} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("products.addFirstProduct")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image ? (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className={`${getStatusColor(product.status!)} text-xs`}>
                              {getStatusText(product.status!)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(product)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t("common.view")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("common.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(product)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("common.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">SKU:</span>
                            <div className="truncate">{product.sku}</div>
                          </div>
                          <div>
                            <span className="font-medium">{t("products.stock")}:</span>
                            <div>{product.stock}</div>
                          </div>
                          <div>
                            <span className="font-medium">{t("products.form.price")}:</span>
                            <div className="font-medium text-foreground">{formatCurrency(product.price!)}</div>
                          </div>
                          <div>
                            <span className="font-medium">{t("products.form.cost")}:</span>
                            <div>{formatCurrency(product.cost!)}</div>
                          </div>
                        </div>

                        {/* Supplier Info */}
                        {product.supplier && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">{t("products.form.supplier")}:</span> {product.supplier}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">{t("products.pagination.previous")}</span>
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number
                    if (totalPages <= 5) {
                      page = i + 1
                    } else if (currentPage <= 3) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i
                    } else {
                      page = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2"
                >
                  <span className="hidden sm:inline mr-1">{t("products.pagination.next")}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
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
