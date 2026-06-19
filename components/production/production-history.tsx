"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Loader2 } from "lucide-react"
import type { ProductionFilters, ProductionRecord, ProductionSortBy } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"
import { Product, ProductionStatus } from "@/types"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { formatDate, getProductionStatusColor } from "@/lib/utils"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { toast } from "@/components/ui/use-toast"
import { getAllProductions } from "@/lib/httpclient"
import { ADMIN_ROUTES, DEFAULT_PAGE_SIZE } from "@/constants"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { FormattedCurrency } from "@/components/ui/formatted-currency"
import Link from "next/link"
import { ProductionHistoryFilterBar } from "@/components/production/production-history-filter-bar"
import { ProductionHistoryFilterModal } from "@/components/production/production-history-filter-modal"
import { ServersidePagination } from "../common/table/ServersidePagination"
import { ProductionRecordItem } from "./production-record-item"

interface ProductionHistoryProps {
  products: Product[]
  onViewRecord: (record: ProductionRecord) => void
  onEditRecord: (record: ProductionRecord) => void
}
type ProductionHistoryRow = ProductionRecord & { id: string }

export function ProductionHistory({ products, onViewRecord, onEditRecord }: ProductionHistoryProps) {
  const { t } = useLanguage()
  const [productions, setProductions] = useState<ProductionRecord[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ProductionFilters>({})
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<ProductionSortBy>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const debouncedSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  const apiParams = useMemo(() => ({
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
    sortBy,
    sortOrder,
    searchTerm: debouncedSearchTerm,
    status: filters.status === "all" ? undefined : filters.status,
    product: filters.product === "all" ? undefined : filters.product,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  }), [currentPage, sortBy, sortOrder, debouncedSearchTerm, filters])

  const tableRows = productions.filter((record): record is ProductionHistoryRow => Boolean(record.id))

  const handleFiltersChange = (nextFilters: ProductionFilters) => {
    setFilters(nextFilters)
    setCurrentPage(1)
  }

  const handleSort = (field: ProductionSortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const handleTableSort = (field: string) => {
    if (["number", "date", "status"].includes(field)) {
      handleSort(field as ProductionSortBy)
      return
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const columns: ServersideTableColumn<ProductionHistoryRow>[] = [
    {
      key: "number",
      title: t("production.history.sheetCode"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <Link
            href={ADMIN_ROUTES.produceDetail(row.number || row.id)}
            className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
          >
            {row.number}
          </Link>
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
      render: (row) => <Badge variant="outline">{row.product?.name}</Badge>,
    },
    {
      key: "quantity",
      title: t("production.history.quantity"),
      sortable: true,
      render: (row) => <FormattedNumber as="span" className="font-medium" value={row.quantity} />,
    },
    {
      key: "totalCost",
      title: t("production.history.expense"),
      sortable: true,
      render: (row) => <FormattedCurrency as="span" className="font-medium" value={row.totalExpense} />,
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
    <>
      <ProductionHistoryFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onShowFilter={() => setShowFilterModal(true)}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <Card>
        <CardContent className="space-y-4 pt-2 lg:pt-6">
          {loading ? 
            (<div className="w-full flex justify-center"><Loader2 className="w-4 h-4 ml-2 animate-spin" /></div>) :
            <>
              <div className="hidden lg:block">
                <ServersideTable
                  columns={columns}
                  data={tableRows}
                  total={total}
                  currentPage={currentPage}
                  pageSize={DEFAULT_PAGE_SIZE}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onPageChange={handlePageChange}
                  onSort={handleTableSort}
                  loading={loading}
                  totalPages={totalPages}
                />
              </div>
              <div className="block lg:hidden">
                <div className="space-y-4 mb-5">
                  {productions.map((record) => (
                    <ProductionRecordItem key={record.id} record={record} onView={onViewRecord} onEdit={onEditRecord} />
                  ))}
                </div>
                <ServersidePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={DEFAULT_PAGE_SIZE}
                  total={total}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          }
        </CardContent>
      </Card>

      <ProductionHistoryFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFiltersChange}
        currentFilters={filters}
        products={products}
      />
    </>
  )
}
