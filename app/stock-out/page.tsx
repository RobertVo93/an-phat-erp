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
  Package,
  TrendingDown,
  Calendar,
  Truck,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StockOutFormModal } from "@/components/stock-out/stock-out-form-modal"
import { StockOutViewModal } from "@/components/stock-out/stock-out-view-modal"
import { StockOutFilterModal } from "@/components/stock-out/stock-out-filter-modal"
import { StockOutDeleteModal } from "@/components/stock-out/stock-out-delete-modal"
import { useStockOut } from "@/hooks/use-stock-out"
import { useLanguage } from "@/contexts/language-context"
import type { StockOut } from "@/types/stock-out"

export default function StockOutPage() {
  const { t } = useLanguage()
  const {
    stockOuts,
    allStockOuts,
    filteredCount,
    totalCount,
    filters,
    setFilters,
    sort,
    setSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    addStockOut,
    updateStockOut,
    deleteStockOut,
    getStockOutById,
  } = useStockOut()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedStockOut, setSelectedStockOut] = useState<StockOut | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleCreateStockOut = () => {
    setFormMode("create")
    setSelectedStockOut(null)
    setIsFormModalOpen(true)
  }

  const handleEditStockOut = (stockOut: StockOut) => {
    setFormMode("edit")
    setSelectedStockOut(stockOut)
    setIsFormModalOpen(true)
  }

  const handleViewStockOut = (stockOut: StockOut) => {
    setSelectedStockOut(stockOut)
    setIsViewModalOpen(true)
  }

  const handleDeleteStockOut = (stockOut: StockOut) => {
    setSelectedStockOut(stockOut)
    setIsDeleteModalOpen(true)
  }

  const handleFormSubmit = (stockOutData: Omit<StockOut, "id" | "receiptNumber" | "createdAt" | "updatedAt">) => {
    if (formMode === "create") {
      addStockOut(stockOutData)
    } else if (selectedStockOut) {
      updateStockOut(selectedStockOut.id, stockOutData)
    }
  }

  const handleDeleteConfirm = () => {
    if (selectedStockOut) {
      deleteStockOut(selectedStockOut.id)
      setIsDeleteModalOpen(false)
      setSelectedStockOut(null)
    }
  }

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value })
    setCurrentPage(1)
  }

  const handleSortChange = (field: string) => {
    const newDirection = sort.field === field && sort.direction === "asc" ? "desc" : "asc"
    setSort({ field: field as any, direction: newDirection })
  }

  // Calculate statistics
  const totalValue = allStockOuts.reduce((sum, record) => sum + record.totalAmount, 0)
  const shippedRecords = allStockOuts.filter(
    (record) => record.status === "shipped" || record.status === "delivered",
  ).length
  const pendingRecords = allStockOuts.filter(
    (record) => record.status === "draft" || record.status === "processing",
  ).length

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("stockOut.title")}</h2>
            <p className="text-muted-foreground">{t("stockOut.description")}</p>
          </div>
          <Button onClick={handleCreateStockOut}>
            <Plus className="mr-2 h-4 w-4" />
            {t("stockOut.newStockOut")}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("stockOut.searchPlaceholder")}
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("common.filter")}
            </Button>
            <Select
              value={`${sort.field}-${sort.direction}`}
              onValueChange={(value) => {
                const [field, direction] = value.split("-")
                setSort({ field: field as any, direction: direction as any })
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("stockOut.sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">{t("stockOut.sortByDate")} ↓</SelectItem>
                <SelectItem value="date-asc">{t("stockOut.sortByDate")} ↑</SelectItem>
                <SelectItem value="customerName-asc">{t("stockOut.sortByCustomer")} ↑</SelectItem>
                <SelectItem value="customerName-desc">{t("stockOut.sortByCustomer")} ↓</SelectItem>
                <SelectItem value="totalAmount-desc">{t("stockOut.sortByAmount")} ↓</SelectItem>
                <SelectItem value="totalAmount-asc">{t("stockOut.sortByAmount")} ↑</SelectItem>
                <SelectItem value="status-asc">{t("stockOut.sortByStatus")} ↑</SelectItem>
                <SelectItem value="status-desc">{t("stockOut.sortByStatus")} ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockOut.totalShipments")}</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-xs text-muted-foreground">{t("common.thisMonth")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockOut.totalValue")}</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t("stockOut.inventoryShipped")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockOut.shipped")}</CardTitle>
              <Truck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shippedRecords}</div>
              <p className="text-xs text-muted-foreground">{t("stockOut.successfullyShipped")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockOut.pending")}</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRecords}</div>
              <p className="text-xs text-muted-foreground">{t("stockOut.awaitingShipment")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Out Records */}
        <Card>
          <CardHeader>
            <CardTitle>{t("common.records")}</CardTitle>
            <CardDescription>{t("stockOut.recentShipments")}</CardDescription>
          </CardHeader>
          <CardContent>
            {stockOuts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t("common.noRecords")}</h3>
                <p className="mt-1 text-sm text-gray-500">{t("common.getStarted")}</p>
                <div className="mt-6">
                  <Button onClick={handleCreateStockOut}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("stockOut.newStockOut")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stockOuts.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-sm font-medium truncate">{record.receiptNumber}</h3>
                          <Badge className={getStatusColor(record.status)}>
                            {t(`stockOut.status.${record.status}`)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">{t("common.date")}:</span> {formatDate(record.date)}
                          </div>
                          <div>
                            <span className="font-medium">{t("stockOut.customer")}:</span> {record.customerName}
                          </div>
                          <div>
                            <span className="font-medium">{t("stockOut.warehouse")}:</span> {record.warehouseName}
                          </div>
                          <div>
                            <span className="font-medium">{t("common.total")}:</span>{" "}
                            {formatCurrency(record.totalAmount)}
                          </div>
                        </div>
                        {record.trackingNumber && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">{t("stockOut.trackingNumber")}:</span> {record.trackingNumber}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewStockOut(record)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditStockOut(record)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteStockOut(record)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("common.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Products Summary */}
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">{t("stockOut.products")}:</p>
                      <div className="space-y-1">
                        {record.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                            <span className="truncate">{product.productName}</span>
                            <span className="ml-2 flex-shrink-0">
                              {product.quantity} × {formatCurrency(product.unitPrice)}
                            </span>
                          </div>
                        ))}
                        {record.products.length > 2 && (
                          <div className="text-xs text-muted-foreground text-center py-1">
                            +{record.products.length - 2} {t("common.moreItems")}
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="text-sm text-muted-foreground">
                  {t("common.showing")} {(currentPage - 1) * itemsPerPage + 1} {t("common.to")}{" "}
                  {Math.min(currentPage * itemsPerPage, filteredCount)} {t("common.of")} {filteredCount}{" "}
                  {t("common.results")}
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number.parseInt(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {t("common.previous")}
                  </Button>
                  <span className="text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("common.next")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <StockOutFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          stockOut={selectedStockOut}
          mode={formMode}
        />

        <StockOutViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          stockOut={selectedStockOut}
        />

        <StockOutFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <StockOutDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          stockOut={selectedStockOut}
        />
      </div>
    </ERPLayout>
  )
}
