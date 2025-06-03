"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  X,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useCollections } from "@/hooks/use-collections"
import { CollectionViewModal } from "@/components/collections/collection-view-modal"
import { CollectionFormModal } from "@/components/collections/collection-form-modal"
import { CollectionFilterModal } from "@/components/collections/collection-filter-modal"
import { CollectionDeleteModal } from "@/components/collections/collection-delete-modal"
import type { Collection } from "@/types/collection"
import { CollectionCategory, CollectionStatus } from "@/types/enums"
import { formatDate } from "@/lib/utils"

export default function CollectionsPage() {
  const { t } = useLanguage()
  const {
    loading,
    collections,
    allCollections,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    resetFilters,
  } = useCollections()

  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; collection: Collection | null }>({
    open: false,
    collection: null,
  })
  const [formModal, setFormModal] = useState<{ open: boolean; collection: Collection | null }>({
    open: false,
    collection: null,
  })
  const [filterModal, setFilterModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; collection: Collection | null }>({
    open: false,
    collection: null,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case CollectionStatus.active:
        return "bg-green-100 text-green-800"
      case CollectionStatus.draft:
        return "bg-yellow-100 text-yellow-800"
      case CollectionStatus.archived:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case CollectionCategory.fashion:
        return "bg-pink-100 text-pink-800"
      case CollectionCategory.electronics:
        return "bg-blue-100 text-blue-800"
      case CollectionCategory.home:
        return "bg-green-100 text-green-800"
      case CollectionCategory.office:
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case CollectionStatus.active:
        return t("collections.status.active")
      case CollectionStatus.draft:
        return t("collections.status.draft")
      case CollectionStatus.archived:
        return t("collections.status.archived")
      default:
        return status
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case CollectionCategory.fashion:
        return t("collections.category.fashion")
      case CollectionCategory.electronics:
        return t("collections.category.electronics")
      case CollectionCategory.home:
        return t("collections.category.home")
      case CollectionCategory.office:
        return t("collections.category.office")
      default:
        return category
    }
  }

  const handleView = (collection: Collection) => {
    setViewModal({ open: true, collection })
  }

  const handleEdit = (collection: Collection) => {
    setFormModal({ open: true, collection })
  }

  const handleDelete = (collection: Collection) => {
    setDeleteModal({ open: true, collection })
  }

  const handleCreate = () => {
    setFormModal({ open: true, collection: null })
  }

  const handleSave = (collectionData: any) => {
    if (formModal.collection) {
      updateCollection(formModal.collection.id!, collectionData)
    } else {
      createCollection(collectionData)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteModal.collection) {
      deleteCollection(deleteModal.collection.id!)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      [t("common.id"), t("common.name"), t("common.description"), t("common.category"), t("common.status"), t("common.products"), t("common.createdAt")],
      ...collections.map((col) => [
        col.id,
        col.name,
        col.description,
        getCategoryText(col.category!),
        getStatusText(col.status!),
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

  const hasActiveFilters = filters.status || filters.category || filters.name || filters.search
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalCollections)

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-4 md:space-y-6">
        {/* Header Section - Mobile Optimized */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("collections.title")}</h2>
              <p className="text-sm md:text-base text-muted-foreground">{t("collections.description")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportToCSV} size="sm" className="flex-1 md:flex-none">
                <Download className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("collections.exportExcel")}</span>
                <span className="sm:hidden">{t("common.export")}</span>
              </Button>
              <Button onClick={handleCreate} size="sm" className="flex-1 md:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("collections.newCollection")}</span>
                <span className="sm:hidden">{t("common.add")}</span>
              </Button>
            </div>
          </div>

          {/* Search and Filter Row */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("collections.searchPlaceholder")}
                className="pl-10 text-sm"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFilterModal(true)}
              className={`${hasActiveFilters ? "border-blue-500 text-blue-600" : ""} flex-shrink-0`}
              size="sm"
            >
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("collections.filter")}</span>
              <span className="sm:hidden">{t("common.filter")}</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {[filters.status, filters.category, filters.name, filters.search].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards - Mobile Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{t("collections.totalCollections")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{allCollections.length}</div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("collections.activeCollectionsDesc")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{t("collections.totalProducts")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {allCollections.reduce((sum, col) => sum + (col.products?.length || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("collections.acrossAllCollections")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{t("collections.totalValue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">$76,450</div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("collections.combinedValue")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{t("collections.activeCollections")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {allCollections.filter((col) => col.status === CollectionStatus.active).length}
              </div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("collections.currentlyActive")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle className="text-lg md:text-xl">{t("collections.allCollections")}</CardTitle>
                <CardDescription className="text-sm">{t("collections.allCollectionsDesc")}</CardDescription>
              </div>
              {/* Mobile-friendly pagination info */}
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                <span className="text-xs md:text-sm text-muted-foreground">
                  {startIndex}-{endIndex} / {totalCollections}
                </span>
                <div className="flex items-center space-x-2">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-16 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">/ {t("common.page")}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <Card key={collection.id} className="border border-gray-200 hover:bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {/* Collection Image */}
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {collection.image ? (
                            <img
                              src={collection.image || "/placeholder.svg"}
                              alt={collection.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Collection Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Title and Status Row */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm md:text-base font-medium truncate">{collection.name}</h3>
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                <Badge className={`${getStatusColor(collection.status!)} text-xs`}>
                                  {getStatusText(collection.status!)}
                                </Badge>
                                <Badge variant="outline" className={`${getCategoryColor(collection.category!)} text-xs`}>
                                  {getCategoryText(collection.category!)}
                                </Badge>
                              </div>
                            </div>

                            {/* Actions Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(collection)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  {t("common.view")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(collection)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("common.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(collection)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("common.delete")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Description */}
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                            {collection.description}
                          </p>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                            <div>
                              <span className="font-medium">{collection.products?.length || 0}</span> {t("collections.products")}
                            </div>
                            {/* <div>
                              <span className="font-medium text-gray-900">{collection.totalValue}</span>
                            </div> */}
                            <div className="col-span-2 md:col-span-2">{t("collections.createdAt")}: {formatDate(collection.createdAt!)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>{t("collections.noCollectionsFound")}</p>
                </div>
              )}
            </div>

            {/* Mobile-Optimized Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Smart pagination - show fewer pages on mobile */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxVisible = 5
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                    const endPage = Math.min(totalPages, startPage + maxVisible - 1)

                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1)
                    }

                    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {page}
                      </Button>
                    ))
                  })()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
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

      <CollectionFilterModal
        filters={filters}
        open={filterModal}
        onOpenChange={setFilterModal}
        onFiltersChange={setFilters}
        onReset={resetFilters}
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
