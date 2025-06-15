"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  Package,
  TrendingUp,
  Calendar,
  CheckCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  Loader2,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useStockChange } from "@/hooks/use-stock-change"
import { StockChangeFormModal } from "@/components/stock-change/stock-change-form-modal"
import { StockChangeViewModal } from "@/components/stock-change/stock-change-view-modal"
import { StockChangeFilterModal } from "@/components/stock-change/stock-change-filter-modal"
import { StockChangeDeleteModal } from "@/components/stock-change/stock-change-delete-modal"
import type { StockChange } from "@/types/stock-change"
import { StockChangeStatus } from "@/types"

export default function StockChangePage() {
  const { t } = useLanguage()
  const {
    stockChangeRecords,
    allStockChangeRecords,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalRecords,
    addStockChange,
    updateStockChange,
    deleteStockChange,
    resetFilters,
    loading,
    products,
    warehouses
  } = useStockChange()

  const [showFormModal, setShowFormModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStockChange, setSelectedStockChange] = useState<StockChange | null>(null)
  const [editingStockChange, setEditingStockChange] = useState<StockChange | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case StockChangeStatus.completed:
        return "bg-green-100 text-green-800"
      case StockChangeStatus.pending:
        return "bg-yellow-100 text-yellow-800"
      case StockChangeStatus.inTransit:
        return "bg-blue-100 text-blue-800"
      case StockChangeStatus.cancelled:
        return "bg-red-100 text-red-800"
      case StockChangeStatus.draft:
        return "bg-gray-100 text-gray-800"
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

  const totalValue = allStockChangeRecords.reduce((sum: number, record: StockChange) => sum + record.totalAmount!, 0)
  const completedRecords = allStockChangeRecords.filter((record: StockChange) => record.status === StockChangeStatus.completed).length
  const pendingRecords = allStockChangeRecords.filter((record: StockChange) => record.status === StockChangeStatus.pending).length

  const handleView = (stockChange: StockChange) => {
    setSelectedStockChange(stockChange)
    setShowViewModal(true)
  }

  const handleEdit = (stockChange: StockChange) => {
    setEditingStockChange(stockChange)
    setShowFormModal(true)
  }

  const handleDelete = (stockChange: StockChange) => {
    setSelectedStockChange(stockChange)
    setShowDeleteModal(true)
  }

  const handleSave = (stockChangeData: Omit<StockChange, "id" | "createdAt" | "updatedAt">) => {
    if (editingStockChange) {
      updateStockChange(editingStockChange.id!, stockChangeData)
      setEditingStockChange(null)
    } else {
      addStockChange(stockChangeData)
    }
    setShowFormModal(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedStockChange) {
      deleteStockChange(selectedStockChange.id!)
      setSelectedStockChange(null)
    }
  }

  const handleSort = (field: "date" | "supplier" | "amount" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("stockIn.title")}</h2>
            <p className="text-muted-foreground">{t("stockIn.description")}</p>
          </div>
          <Button onClick={() => setShowFormModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("stockIn.newStockIn")}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("stockIn.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowFilterModal(true)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("stockIn.filter")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {t("stockIn.sort")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleSort("date")}>
                  {t("stockIn.sort.date")} {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("supplier")}>
                  {t("stockIn.sort.supplier")} {sortBy === "supplier" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("amount")}>
                  {t("stockIn.sort.amount")} {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>
                  {t("stockIn.status")} {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.totalReceipts")}</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allStockChangeRecords.length}</div>
              <p className="text-xs text-muted-foreground">{t("stockIn.thisMonth")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.totalValue")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">{t("stockIn.inventory")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.completed")}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRecords}</div>
              <p className="text-xs text-muted-foreground">{t("stockIn.receivedSuccess")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.pending")}</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRecords}</div>
              <p className="text-xs text-muted-foreground">{t("stockIn.waitForDelivery")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock changes Records */}
        <Card>
          <CardHeader>
            <CardTitle>{t("stockIn.stockInSheet")}</CardTitle>
            <CardDescription>{t("stockIn.stockInSheetsList")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockChangeRecords.map((record: StockChange) => (
                <div key={record.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium">{record.receiptNumber}</h3>
                      <Badge className={getStatusColor(record.status!)}>{t(`stockIn.status.${record.status}`)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold">{formatCurrency(record.totalAmount!)}</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleView(record)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("stockIn.view")}
                          </DropdownMenuItem>
                          {record.status !== StockChangeStatus.completed &&
                            <DropdownMenuItem onClick={() => handleEdit(record)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("stockIn.edit")}
                            </DropdownMenuItem>
                          }
                          {record.status !== StockChangeStatus.completed &&
                            <DropdownMenuItem onClick={() => handleDelete(record)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("stockIn.delete")}
                            </DropdownMenuItem>
                          }
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-muted-foreground mb-3">
                    <div>
                      <span className="font-medium">{t("stockIn.stockType")}:</span> {t(`stockIn.form.${record.type}`)}
                    </div>
                    <div>
                      <span className="font-medium">{t("stockIn.date")}:</span> {formatDate(`${record.date}`)}
                    </div>
                    <div>
                      <span className="font-medium">{t("stockIn.supplier")}:</span> {record.supplier!}
                    </div>
                    <div>
                      <span className="font-medium">{t("stockIn.warehouse")}:</span> {record.warehouse?.name!}
                    </div>
                    {record.referenceNumber && (
                      <div>
                        <span className="font-medium">{t("stockIn.reference")}:</span> {record.referenceNumber}
                      </div>
                    )}
                    {record.receivedBy && (
                      <div>
                        <span className="font-medium">{t("stockIn.receivedBy")}:</span> {record.receivedBy}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">{t("stockIn.products")}:</p>
                    {record.stockProducts && record.stockProducts.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                        <span>{item.product?.name}</span>
                        <span>
                          {item.quantity!.toLocaleString()} × {formatCurrency(item.unitCost!)} ={" "}
                          {formatCurrency(item.quantity! * item.unitCost!)}
                        </span>
                      </div>
                    ))}
                    {record.stockProducts && record.stockProducts.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">+{record.stockProducts!.length - 3} {t("stockIn.otherProducts")}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("stockIn.display")}</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">{t("stockIn.section")}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {t("stockIn.previous")}
                  </Button>
                  <span className="text-sm text-gray-600">
                    {t("stockIn.page")} {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("stockIn.next")}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
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
    </ERPLayout>
  )
}
