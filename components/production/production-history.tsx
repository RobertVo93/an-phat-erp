"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Eye, Edit, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import type { ProductionRecord } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"
import { ProductionStatus } from "@/types"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { formatDate, formatLargeCurrency, getProductionStatusColor } from "@/lib/utils"

interface ProductionHistoryProps {
  historyRecords: ProductionRecord[]
  onViewRecord: (record: ProductionRecord) => void
  onEditRecord: (record: ProductionRecord) => void
}

export function ProductionHistory({
  historyRecords,
  onViewRecord,
  onEditRecord
}: ProductionHistoryProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [productFilter, setProductFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Lọc dữ liệu
  const filteredData = historyRecords.filter((record) => {
    const matchesSearch =
      record.number!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.product?.name!.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesProduct = !productFilter || productFilter === "all" || record.product?.id === productFilter

    const recordDate = new Date(record.date!)
    const matchesDateFrom = !dateFrom || recordDate >= dateFrom
    const matchesDateTo = !dateTo || recordDate <= dateTo

    return matchesSearch && matchesStatus && matchesProduct && matchesDateFrom && matchesDateTo
  })

  // Phân trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Lấy danh sách sản phẩm unique
  const uniqueProducts = Array.from(
    new Map(
      historyRecords
        .filter(r => r.product?.id)
        .map(r => [r.product!.id, r.product!])
    ).values()
  );

  const onChangeProductFileter = (productId: string) => {
    setProductFilter(productId)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setProductFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setCurrentPage(1)
  }

  const exportData = () => {
    // Xuất dữ liệu CSV
    const headers = ["Mã đơn", "Ngày", "Sản phẩm", "Số lượng", "Trạng thái", "Chi phí"]
    const csvData = filteredData.map((record) => [
      record.id,
      record.date,
      record.product,
      `${record.quantity}`,
      record.totalCost!.toLocaleString(),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lich-su-san-xuat-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Define columns for ServersideTable
  const columns: ServersideTableColumn<ProductionRecord>[] = [
    {
      key: "number",
      title: t("production.history.sheetCode"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.number}</p>
        </div>
      ),
    },
    {
      key: "date",
      title: t("production.history.date"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.date ? formatDate(row.date) : "-"}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("production.history.status"),
      render: (row) => <Badge className={getProductionStatusColor(row.status!)}>{t(`production.history.${row.status!}`)}</Badge>,
    },
    {
      key: "product",
      title: t("production.history.product"),
      render: (row) => (
        <Badge variant="outline">{row.product!.name}</Badge>
      ),
    },
    {
      key: "quantity",
      title: t("production.history.quantity"),
      sortable: true,
      render: (row) => <span className="font-medium">{row.quantity}</span>,
    },
    {
      key: "totalCost",
      title: t("production.history.expense"),
      sortable: true,
      render: (row) => <span className="font-medium">{formatLargeCurrency(row.totalCost!)}</span>,
    },
    {
      key: "actions",
      title: t("common.actions"),
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewRecord(row)}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
          {row.status !== ProductionStatus.completed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditRecord(row)}
              className="h-7 w-7 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg">{t("production.history.title")}</CardTitle>
            <CardDescription className="text-sm">{t("production.history.list")}</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              {t("production.history.reset")}
            </Button>
            <Button variant="outline" size="sm" onClick={exportData} className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              {t("production.history.exportExcel")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bộ lọc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">{t("production.history.search")}</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder={t("production.history.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t("production.history.status")}</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("production.history.all")}</SelectItem>
                {Object.values(ProductionStatus).map((status) => (
                  <SelectItem key={status} value={status}>{t(`production.history.${status}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t("production.history.product")}</Label>
            <Select value={productFilter} onValueChange={onChangeProductFileter}>
              <SelectTrigger className="h-9">
                <SelectValue>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("production.history.all")}</SelectItem>
                {uniqueProducts.map((product) => (
                  <SelectItem
                    key={`${product?.id!}-${product?.sku}`}
                    value={product?.id!}
                  >
                    {product?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lọc theo ngày */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">{t("production.history.fromDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : t("production.history.selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">{t("production.history.toDate")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : t("production.history.selectDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold">{filteredData.length}</div>
            <div className="text-xs text-gray-600">{t("production.history.sheetNumber")}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{filteredData.filter((r) => r.status === "completed").length}</div>
            <div className="text-xs text-gray-600">{t("production.history.completed")}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {filteredData.reduce((sum, r) => sum + r.quantity!, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">{t("production.history.totalProduction")}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {(filteredData.reduce((sum, r) => sum + r.totalCost!, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600">{t("production.history.totalExpense")}</div>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <ServersideTable
          columns={columns as ServersideTableColumn<{ id: string | number }>[]}
          data={paginatedData as { id: string | number }[]}
          total={filteredData.length}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          sortBy={""}
          sortOrder={"asc"}
          onPageChange={setCurrentPage}
          onSort={() => { }}
          loading={false}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  )
}
