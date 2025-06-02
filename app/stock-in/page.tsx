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
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useStockIn } from "@/hooks/use-stock-in"
import { StockInFormModal } from "@/components/stock-in/stock-in-form-modal"
import { StockInViewModal } from "@/components/stock-in/stock-in-view-modal"
import { StockInFilterModal } from "@/components/stock-in/stock-in-filter-modal"
import { StockInDeleteModal } from "@/components/stock-in/stock-in-delete-modal"
import type { StockIn } from "@/types/stock-in"

export default function StockInPage() {
  const { t } = useLanguage()
  const {
    stockInRecords,
    allStockInRecords,
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
    addStockIn,
    updateStockIn,
    deleteStockIn,
    resetFilters,
  } = useStockIn()

  const [showFormModal, setShowFormModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStockIn, setSelectedStockIn] = useState<StockIn | null>(null)
  const [editingStockIn, setEditingStockIn] = useState<StockIn | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "draft":
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

  const totalValue = allStockInRecords.reduce((sum, record) => sum + record.totalAmount, 0)
  const completedRecords = allStockInRecords.filter((record) => record.status === "completed").length
  const pendingRecords = allStockInRecords.filter((record) => record.status === "pending").length

  const handleView = (stockIn: StockIn) => {
    setSelectedStockIn(stockIn)
    setShowViewModal(true)
  }

  const handleEdit = (stockIn: StockIn) => {
    setEditingStockIn(stockIn)
    setShowFormModal(true)
  }

  const handleDelete = (stockIn: StockIn) => {
    setSelectedStockIn(stockIn)
    setShowDeleteModal(true)
  }

  const handleSave = (stockInData: Omit<StockIn, "id" | "createdAt" | "updatedAt">) => {
    if (editingStockIn) {
      updateStockIn(editingStockIn.id, stockInData)
      setEditingStockIn(null)
    } else {
      addStockIn(stockInData)
    }
    setShowFormModal(false)
  }

  const handleDeleteConfirm = () => {
    if (selectedStockIn) {
      deleteStockIn(selectedStockIn.id)
      setSelectedStockIn(null)
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
              <div className="text-2xl font-bold">{allStockInRecords.length}</div>
              <p className="text-xs text-muted-foreground">Tháng này</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.totalValue")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">Hàng tồn kho nhận</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.completed")}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRecords}</div>
              <p className="text-xs text-muted-foreground">Đã nhận thành công</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stockIn.pending")}</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRecords}</div>
              <p className="text-xs text-muted-foreground">Chờ nhận hàng</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock In Records */}
        <Card>
          <CardHeader>
            <CardTitle>Phiếu Nhập Kho</CardTitle>
            <CardDescription>Danh sách phiếu nhập kho và hàng tồn kho đến</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockInRecords.map((record) => (
                <div key={record.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium">{record.receiptNumber}</h3>
                      <Badge className={getStatusColor(record.status)}>{t(`stockIn.status.${record.status}`)}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-bold">{formatCurrency(record.totalAmount)}</div>
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
                          <DropdownMenuItem onClick={() => handleEdit(record)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("stockIn.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(record)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("stockIn.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-muted-foreground mb-3">
                    <div>
                      <span className="font-medium">{t("stockIn.date")}:</span> {formatDate(record.date)}
                    </div>
                    <div>
                      <span className="font-medium">{t("stockIn.supplier")}:</span> {record.supplierName}
                    </div>
                    <div>
                      <span className="font-medium">{t("stockIn.warehouse")}:</span> {record.warehouseName}
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
                    {record.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                        <span>{item.productName}</span>
                        <span>
                          {item.quantity.toLocaleString()} × {formatCurrency(item.unitCost)} ={" "}
                          {formatCurrency(item.totalCost)}
                        </span>
                      </div>
                    ))}
                    {record.items.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">+{record.items.length - 3} sản phẩm khác</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hiển thị</span>
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
                  <span className="text-sm text-gray-600">mục</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <StockInFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingStockIn(null)
        }}
        onSave={handleSave}
        stockIn={editingStockIn}
      />

      <StockInViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} stockIn={selectedStockIn} />

      <StockInFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={setFilters}
        currentFilters={filters}
      />

      <StockInDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        stockIn={selectedStockIn}
      />
    </ERPLayout>
  )
}
