"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RangePickerCalendar } from "@/components/ui/calendar"
import { Search, Eye, Edit } from "lucide-react"
import type { ProductionFilters, ProductionRecord, ProductionSortBy } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"
import { ProductionStatus } from "@/types"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { formatDate, formatLargeCurrency, formatYYYYMMDD, getCurrentMonthRange, getProductionStatusColor } from "@/lib/utils"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { toast } from "@/components/ui/use-toast"
import { getAllProductions } from "@/lib/httpclient"
import { DEFAULT_PAGE_SIZE } from "@/constants"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { FormattedCurrency } from "@/components/ui/formatted-currency"

interface ProductionHistoryProps {
  onViewRecord: (record: ProductionRecord) => void
  onEditRecord: (record: ProductionRecord) => void
}
const defaultRange = getCurrentMonthRange()

export function ProductionHistory({
  onViewRecord,
  onEditRecord
}: ProductionHistoryProps) {
  const { t } = useLanguage()
  const [productions, setProductions] = useState<ProductionRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ProductionFilters>({
    status: "all",
    product: "all",
    dateFrom: formatYYYYMMDD(defaultRange[0]),
    dateTo: formatYYYYMMDD(defaultRange[1])
  })
  // pagination
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<ProductionSortBy>("number")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Debounce searchTerm
  const debouncedSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  // Build params for API
  const apiParams = useMemo(() => {
    return {
      page: currentPage,
      limit: DEFAULT_PAGE_SIZE,
      sortBy,
      sortOrder,
      searchTerm: debouncedSearchTerm,
      status: filters.status === "all" ? undefined : filters.status,
      product: filters.product === "all" ? undefined : filters.product,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    }
  }, [currentPage, DEFAULT_PAGE_SIZE, sortBy, sortOrder, debouncedSearchTerm, filters])

  // Lấy danh sách sản phẩm unique
  const uniqueProducts = useMemo(() => {
    return Array.from(
      new Map(
        productions
          .filter(r => r.product?.id)
          .map(r => [r.product!.id, r.product!])
      ).values()
    );
  }, [productions]);

  const onChangeProductFileter = (productId: string) => {
    setFilters(prev => ({ ...prev, product: productId }))
  }

  const onChangeStatusFilter = (status: ProductionStatus) => {
    setFilters(prev => ({ ...prev, status: status }))
  }

  const onChangeDateFrom = (selectedDate: string | Date) => {
    setFilters(prev => ({ ...prev, dateFrom: `${selectedDate}` }))
  }

  const onChangeDateTo = (selectedDate: string | Date) => {
    setFilters(prev => ({ ...prev, dateTo: `${selectedDate}` }))
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field as ProductionSortBy)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Define columns for ServersideTable
  const columns: ServersideTableColumn<any>[] = [
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
      sortable: false,
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

  const fetchProductions = async (params: ProductionFilters) => {
    setLoading(true)
    try {
      const res = await getAllProductions(params)
      setProductions(res.data)
      setTotal(res.total)
      setTotalPages(Math.ceil(res.total / (params.limit || 10)))
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotLoad"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductions(apiParams)
  }, [apiParams])

  return (
    <Card>
      <CardHeader className="hidden lg:block">
        <CardTitle className="text-base sm:text-lg">{t("production.history.title")}</CardTitle>
        <CardDescription className="text-sm">{t("production.history.list")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {/* Bộ lọc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="space-y-1 lg:col-span-6">
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

          <div className="space-y-1 lg:col-span-2">
            <Label className="text-xs">{t("production.history.status")}</Label>
            <Select value={filters.status} onValueChange={onChangeStatusFilter}>
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

          <div className="space-y-1 lg:col-span-2">
            <Label className="text-xs">{t("production.history.product")}</Label>
            <Select value={filters.product} onValueChange={onChangeProductFileter}>
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
          {/* Lọc theo ngày */}
          <div className="space-y-1 lg:col-span-2">
            <Label className="text-xs">{t("production.history.fromDate")}</Label>
            <RangePickerCalendar
              startDate={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
              endDate={filters.dateTo ? new Date(filters.dateTo) : undefined}
              mode="day"
              onDateRangeChange={(range) => {
                onChangeDateFrom(range.from);
                onChangeDateTo(range.to);
              }}
            />
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="hidden lg:grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <FormattedNumber as="div" className="text-lg font-semibold" value={productions.reduce((sum, r) => sum + r.quantity!, 0)} />
            <div className="text-xs text-gray-600">{t("production.history.totalProduction")}</div>
          </div>
          <div className="text-center">
            <FormattedCurrency as="div" className="text-lg font-semibold" value={productions.reduce((sum, r) => sum + r.totalCost!, 0)} />
            <div className="text-xs text-gray-600">{t("production.history.totalRevenue")}</div>
          </div>
          <div className="text-center">
            <FormattedCurrency as="div" className="text-lg font-semibold" value={productions.reduce((sum, r) => sum + r.totalExpense!, 0)} />
            <div className="text-xs text-gray-600">{t("production.history.totalExpense")}</div>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <ServersideTable
          columns={columns}
          data={productions}
          total={total}
          currentPage={currentPage}
          pageSize={DEFAULT_PAGE_SIZE}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onPageChange={handlePageChange}
          onSort={handleSort}
          loading={loading}
          totalPages={totalPages}
        />
      </CardContent>
    </Card>
  )
}
