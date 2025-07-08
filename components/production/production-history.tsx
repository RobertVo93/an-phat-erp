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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Search, Eye, Edit, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import type { ProductionRecord } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"
import { ProductionStatus } from "@/types"

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
  const [shiftFilter, setShiftFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Lọc dữ liệu
  const filteredData = historyRecords.filter((record) => {
    const matchesSearch =
      record.productionNumber!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.product?.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.operator!.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesProduct = !productFilter || productFilter === "all" || record.product?.id === productFilter
    const matchesShift = shiftFilter === "all" || record.shift === shiftFilter

    const recordDate = new Date(record.date!)
    const matchesDateFrom = !dateFrom || recordDate >= dateFrom
    const matchesDateTo = !dateTo || recordDate <= dateTo

    return matchesSearch && matchesStatus && matchesProduct && matchesShift && matchesDateFrom && matchesDateTo
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

  const getStatusColor = (status: ProductionStatus) => {
    switch (status) {
      case ProductionStatus.completed:
        return "bg-green-100 text-green-800"
      case ProductionStatus.inProgress:
        return "bg-blue-100 text-blue-800"
      case ProductionStatus.cancelled:
        return "bg-red-100 text-red-800"
      case ProductionStatus.paused:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadge = (status: ProductionStatus) => {
    return <Badge className={getStatusColor(status)}>{t(`production.history.${status}`)}</Badge>
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setProductFilter("all")
    setShiftFilter("all")
    setDateFrom(undefined)
    setDateTo(undefined)
    setCurrentPage(1)
  }

  const exportData = () => {
    // Xuất dữ liệu CSV
    const headers = ["Mã đơn", "Ngày", "Sản phẩm", "Số lượng", "Trạng thái", "Ca", "Người vận hành", "Chi phí"]
    const csvData = filteredData.map((record) => [
      record.id,
      record.date,
      record.product,
      `${record.quantity}`,
      record.shift,
      record.operator,
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
                <SelectItem value={ProductionStatus.completed}>{t("production.history.completed")}</SelectItem>
                <SelectItem value={ProductionStatus.inProgress}>{t("production.history.in-progress")}</SelectItem>
                <SelectItem value={ProductionStatus.cancelled}>{t("production.history.cancelled")}</SelectItem>
                <SelectItem value={ProductionStatus.paused}>{t("production.history.paused")}</SelectItem>
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
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{t("production.history.sheetCode")}</TableHead>
                  <TableHead className="text-xs">{t("production.history.date")}</TableHead>
                  <TableHead className="text-xs">{t("production.history.product")}</TableHead>
                  <TableHead className="text-xs">{t("production.history.quantity")}</TableHead>
                  <TableHead className="text-xs">{t("production.history.status")}</TableHead>
                  <TableHead className="text-xs">{t("production.history.expense")}</TableHead>
                  <TableHead className="text-xs">{t("production.history.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-xs">{record.productionNumber}</TableCell>
                    <TableCell className="text-xs">{format(new Date(record.date!), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-xs">{record.product?.name!}</TableCell>
                    <TableCell className="text-xs">{record.quantity}</TableCell>
                    <TableCell className="text-xs">{getStatusBadge(record.status!)}</TableCell>
                    <TableCell className="text-xs">{record.totalCost!.toLocaleString()} đ</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRecord(record)}
                          className="h-7 w-7 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {record.status !== ProductionStatus.completed && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditRecord(record)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {t("production.history.display")} {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} {t("production.history.of")}{" "}
              {filteredData.length} {t("production.history.result")}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-xs"
              >
                {t("production.history.previous")}
              </Button>
              <span className="text-xs">
                {t("production.history.page")} {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-xs"
              >
                {t("production.history.next")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
