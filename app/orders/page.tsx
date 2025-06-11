"use client"

import { useState, useMemo } from "react"
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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  User,
  CreditCard,
  Loader2,
} from "lucide-react"
import { NewOrderModal } from "@/components/modals/new-order-modal"
import { OrderFilterModal } from "@/components/orders/order-filter-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useOrders } from "@/hooks/use-orders"
import type { OrderFilters, OrderSearchParams } from "@/types/order"
import { formatDate } from "@/lib/utils"
import { OrderStatus } from "@/types/enums"

export default function OrdersPage() {
  const { t } = useLanguage()
  const {
    allCustomers,
    allProducts,
    loading,
    getCustomersAndProducts,
    searchAndFilterOrders,
    createOrder
  } = useOrders()

  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<OrderFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<"date" | "amount" | "customer" | "status">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const searchParams: OrderSearchParams = {
    search: searchTerm,
    filters,
    page: currentPage,
    limit: pageSize,
    sortBy,
    sortOrder,
  }

  const { orders, total, totalPages } = useMemo(() => {
    return searchAndFilterOrders(searchParams)
  }, [searchTerm, filters, currentPage, pageSize, sortBy, sortOrder, searchAndFilterOrders])

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.completed:
        return "bg-green-100 text-green-800"
      case OrderStatus.processing:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.shipped:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.delivered:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.pending:
        return "bg-gray-100 text-gray-800"
      case OrderStatus.cancelled:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    return t(`orders.status.${status}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== null,
  ).length

  const renderMobilePagination = () => {
    return (
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="text-sm text-muted-foreground text-center sm:text-left">
          {t("orders.pagination.showing")} {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, total)} {t("orders.pagination.of")} {total} {t("orders.pagination.results")}
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-1 sm:flex-none"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("orders.pagination.previous")}
          </Button>

          <div className="flex items-center space-x-1">
            <span className="text-sm px-2">{currentPage}</span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm px-2">{totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex-1 sm:flex-none"
          >
            {t("orders.pagination.next")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  const renderDesktopPagination = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>,
      )
    }

    return (
      <div className="hidden lg:flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("orders.pagination.showing")} {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, total)} {t("orders.pagination.of")} {total} {t("orders.pagination.results")}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("orders.pagination.previous")}
          </Button>

          {pages}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {t("orders.pagination.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("orders.title")}</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{t("orders.description")}</p>
          </div>
          <Button onClick={() => setShowNewOrderModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("orders.newOrder")}
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("orders.searchPlaceholder")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="flex space-x-2 sm:space-x-4">
            <Button variant="outline" onClick={() => setShowFilterModal(true)} className="relative flex-1 sm:flex-none">
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">{t("orders.filter")}</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-20 sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Sort Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSort("date")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("orders.date")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("customer")}>
                  <User className="mr-2 h-4 w-4" />
                  {t("orders.customer")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("amount")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t("orders.amount")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSort("status")}>{t("orders.status")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t("orders.allOrders")}</CardTitle>
            <CardDescription className="text-sm">
              {t("orders.allOrdersDescription")} ({total} {t("orders.items")})
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {orders.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-muted-foreground">{t("orders.noOrders")}</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowNewOrderModal(true)}>
                  {t("orders.addFirstOrder")}
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  {/* Table Header */}
                  <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm">
                    <Button
                      variant="ghost"
                      className="justify-start p-0 h-auto font-medium"
                      onClick={() => handleSort("date")}
                    >
                      {t("orders.orderNumber")} / {t("orders.date")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start p-0 h-auto font-medium"
                      onClick={() => handleSort("customer")}
                    >
                      {t("orders.customer")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start p-0 h-auto font-medium"
                      onClick={() => handleSort("status")}
                    >
                      {t("orders.status")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <div>{t("orders.paymentStatus")}</div>
                    <Button
                      variant="ghost"
                      className="justify-start p-0 h-auto font-medium"
                      onClick={() => handleSort("amount")}
                    >
                      {t("orders.amount")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="text-center">{t("common.actions")}</div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="grid grid-cols-6 gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.deliveryDate!)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{order.customer?.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
                        </div>
                        <div>
                          <Badge className={getStatusColor(order.status!)}>{getStatusText(order.status!)}</Badge>
                        </div>
                        <div>
                          <Badge variant="outline">{t(`orders.paymentStatus.${order.paymentStatus}`)}</Badge>
                        </div>
                        <div className="font-medium">{formatCurrency(order.totalAmount!)}</div>
                        <div className="flex justify-center">
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              {t("common.view")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-3 p-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="space-y-1">
                            <p className="font-medium text-sm">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {formatDate(order.deliveryDate!)}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/orders/${order.id}`}>{t("common.view")}</Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("orders.customer")}:</span>
                            <span className="text-sm font-medium">{order.customer?.name}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("orders.amount")}:</span>
                            <span className="text-sm font-bold">{formatCurrency(order.totalAmount!)}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("orders.status")}:</span>
                            <Badge className={getStatusColor(order.status!)} variant="secondary">
                              {getStatusText(order.status!)}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("orders.paymentStatus")}:</span>
                            <Badge variant="outline" className="text-xs">
                              {t(`orders.paymentStatus.${order.paymentStatus}`)}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 px-4 sm:px-0">
                    {renderDesktopPagination()}
                    <div className="lg:hidden">{renderMobilePagination()}</div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <NewOrderModal
        open={showNewOrderModal}
        customers={allCustomers}
        products={allProducts}
        getCustomersAndProducts={getCustomersAndProducts}
        onOpenChange={setShowNewOrderModal}
        createOrder={createOrder}
      />
      <OrderFilterModal
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </ERPLayout>
  )
}
