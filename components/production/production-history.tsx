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

interface ProductionHistoryProps {
  onViewRecord: (record: ProductionRecord) => void
  onEditRecord: (record: ProductionRecord) => void
}

// Dữ liệu mẫu lịch sử sản xuất
const productionHistory: ProductionRecord[] = [
  {
    id: "PR001",
    date: "2024-01-15",
    product: "Mì Gạo",
    quantity: 150,
    unit: "kg",
    status: "completed",
    statusText: "Hoàn thành",
    shift: "Sáng",
    operator: "Nguyễn Văn A",
    rawMaterials: [
      { name: "Gạo", quantity: 120, unit: "kg", cost: 240000 },
      { name: "Nước", quantity: 200, unit: "L", cost: 20000 },
    ],
    utilities: [
      { name: "Điện", quantity: 45, unit: "kWh", cost: 135000 },
      { name: "Gas", quantity: 15, unit: "m³", cost: 75000 },
    ],
    labor: { hours: 8, workers: 3, cost: 480000 },
    totalCost: 980000,
    efficiency: 92,
  },
  {
    id: "PR002",
    date: "2024-01-14",
    product: "Mì Lúa Mì",
    quantity: 100,
    unit: "kg",
    status: "completed",
    statusText: "Hoàn thành",
    shift: "Chiều",
    operator: "Trần Thị B",
    rawMaterials: [
      { name: "Bột mì", quantity: 80, unit: "kg", cost: 200000 },
      { name: "Nước", quantity: 150, unit: "L", cost: 15000 },
    ],
    utilities: [
      { name: "Điện", quantity: 35, unit: "kWh", cost: 105000 },
      { name: "Gas", quantity: 12, unit: "m³", cost: 60000 },
    ],
    labor: { hours: 6, workers: 2, cost: 240000 },
    totalCost: 620000,
    efficiency: 88,
  },
  {
    id: "PR003",
    date: "2024-01-13",
    product: "Bánh Phở",
    quantity: 200,
    unit: "kg",
    status: "completed",
    statusText: "Hoàn thành",
    shift: "Sáng",
    operator: "Lê Văn C",
    rawMaterials: [
      { name: "Gạo", quantity: 180, unit: "kg", cost: 360000 },
      { name: "Tinh bột", quantity: 20, unit: "kg", cost: 440000 },
    ],
    utilities: [
      { name: "Điện", quantity: 50, unit: "kWh", cost: 175000 },
      { name: "Gas", quantity: 18, unit: "m³", cost: 90000 },
    ],
    labor: { hours: 10, workers: 4, cost: 680000 },
    totalCost: 1745000,
    efficiency: 95,
  },
  {
    id: "PR004",
    date: "2024-01-12",
    product: "Mì Ăn Liền",
    quantity: 500,
    unit: "gói",
    status: "cancelled",
    statusText: "Đã hủy",
    shift: "Tối",
    operator: "Phạm Thị D",
    rawMaterials: [
      { name: "Bột mì", quantity: 50, unit: "kg", cost: 125000 },
      { name: "Dầu ăn", quantity: 10, unit: "L", cost: 450000 },
    ],
    utilities: [{ name: "Điện", quantity: 25, unit: "kWh", cost: 87500 }],
    labor: { hours: 4, workers: 2, cost: 240000 },
    totalCost: 902500,
    efficiency: 0,
  },
  {
    id: "PR005",
    date: "2024-01-11",
    product: "Mì Gạo",
    quantity: 120,
    unit: "kg",
    status: "completed",
    statusText: "Hoàn thành",
    shift: "Sáng",
    operator: "Hoàng Văn E",
    rawMaterials: [
      { name: "Gạo", quantity: 100, unit: "kg", cost: 200000 },
      { name: "Muối", quantity: 2, unit: "kg", cost: 16000 },
    ],
    utilities: [
      { name: "Điện", quantity: 40, unit: "kWh", cost: 140000 },
      { name: "Gas", quantity: 12, unit: "m³", cost: 60000 },
    ],
    labor: { hours: 7, workers: 3, cost: 420000 },
    totalCost: 836000,
    efficiency: 89,
  },
]

export function ProductionHistory({ onViewRecord, onEditRecord }: ProductionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [productFilter, setProductFilter] = useState("all")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Lọc dữ liệu
  const filteredData = productionHistory.filter((record) => {
    const matchesSearch =
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.operator.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesProduct = productFilter === "all" || record.product === productFilter
    const matchesShift = shiftFilter === "all" || record.shift === shiftFilter

    const recordDate = new Date(record.date)
    const matchesDateFrom = !dateFrom || recordDate >= dateFrom
    const matchesDateTo = !dateTo || recordDate <= dateTo

    return matchesSearch && matchesStatus && matchesProduct && matchesShift && matchesDateFrom && matchesDateTo
  })

  // Phân trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Lấy danh sách sản phẩm unique
  const uniqueProducts = [...new Set(productionHistory.map((record) => record.product))]

  const getStatusBadge = (status: string, statusText: string) => {
    const variants = {
      completed: "default",
      "in-progress": "secondary",
      cancelled: "destructive",
      paused: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{statusText}</Badge>
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
      `${record.quantity} ${record.unit}`,
      record.statusText,
      record.shift,
      record.operator,
      record.totalCost.toLocaleString(),
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
            <CardTitle className="text-base sm:text-lg">Lịch Sử Sản Xuất</CardTitle>
            <CardDescription className="text-sm">Danh sách tất cả đơn sản xuất từ trước đến nay</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters} className="text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportData} className="text-xs">
              <Download className="w-3 h-3 mr-1" />
              Xuất Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bộ lọc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Mã đơn, sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Trạng thái</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="in-progress">Đang sản xuất</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="paused">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Sản phẩm</Label>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {uniqueProducts.map((product) => (
                  <SelectItem key={product} value={product}>
                    {product}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Ca làm việc</Label>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Sáng">Ca Sáng</SelectItem>
                <SelectItem value="Chiều">Ca Chiều</SelectItem>
                <SelectItem value="Tối">Ca Tối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lọc theo ngày */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Từ ngày</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Đến ngày</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Chọn ngày"}
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
            <div className="text-xs text-gray-600">Tổng đơn</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{filteredData.filter((r) => r.status === "completed").length}</div>
            <div className="text-xs text-gray-600">Hoàn thành</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {filteredData.reduce((sum, r) => sum + r.quantity, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Tổng SL</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {(filteredData.reduce((sum, r) => sum + r.totalCost, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-600">Tổng CP</div>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Mã đơn</TableHead>
                  <TableHead className="text-xs">Ngày</TableHead>
                  <TableHead className="text-xs">Sản phẩm</TableHead>
                  <TableHead className="text-xs">Số lượng</TableHead>
                  <TableHead className="text-xs">Trạng thái</TableHead>
                  <TableHead className="text-xs">Ca</TableHead>
                  <TableHead className="text-xs">Người VH</TableHead>
                  <TableHead className="text-xs">Chi phí</TableHead>
                  <TableHead className="text-xs">Hiệu suất</TableHead>
                  <TableHead className="text-xs">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium text-xs">{record.id}</TableCell>
                    <TableCell className="text-xs">{format(new Date(record.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-xs">{record.product}</TableCell>
                    <TableCell className="text-xs">
                      {record.quantity} {record.unit}
                    </TableCell>
                    <TableCell className="text-xs">{getStatusBadge(record.status, record.statusText)}</TableCell>
                    <TableCell className="text-xs">{record.shift}</TableCell>
                    <TableCell className="text-xs">{record.operator}</TableCell>
                    <TableCell className="text-xs">{record.totalCost.toLocaleString()} đ</TableCell>
                    <TableCell className="text-xs">
                      <span
                        className={
                          record.efficiency >= 90
                            ? "text-green-600"
                            : record.efficiency >= 80
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {record.efficiency}%
                      </span>
                    </TableCell>
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
                        {record.status !== "cancelled" && (
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
              Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} của{" "}
              {filteredData.length} kết quả
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-xs"
              >
                Trước
              </Button>
              <span className="text-xs">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-xs"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
