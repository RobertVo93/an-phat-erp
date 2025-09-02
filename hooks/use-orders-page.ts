import { useState, useMemo, useEffect } from "react"
import type { OrderFilters, OrderSortBy } from "@/types/order"
import { CustomerStatus, OrderStatus, PaymentMethod, PaymentStatus, WarehouseStatus } from "@/types/enums"
import { Customer, Order, Warehouse } from "@/types"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { getCustomers } from "@/lib/httpclient/customer.client"
import { getOrders as apiGetOrders, createOrder as apiCreateOrder } from "@/lib/httpclient/order.client"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"


export function useOrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [allCustomers, setAllCustomers] = useState<Customer[]>([])
  const [allWarehouses, setAllWarehouses] = useState<Warehouse[]>([])
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<OrderFilters>({})
  // pagination
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState<OrderSortBy>("deliveryDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Debounce searchTerm
  const debouncedSearchTerm = useDebounceSearchTerm(searchTerm, 500)

  // Build params for API
  const apiParams = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
      searchTerm: debouncedSearchTerm,
      status: filters.status === "all" ? undefined : filters.status,
      paymentStatus: filters.paymentStatus === "all" ? undefined : filters.paymentStatus,
      paymentMethod: filters.paymentMethod === "all" ? undefined : filters.paymentMethod,
      customer: filters.customer,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      totalAmountFrom: filters.totalAmountFrom,
      totalAmountTo: filters.totalAmountTo,
    }
  }, [currentPage, pageSize, sortBy, sortOrder, debouncedSearchTerm, filters])

  const activeFiltersCount = useMemo(() => Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== null,
  ).length, [filters])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field as OrderSortBy)
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

  const fetchOrders = async (params: OrderFilters) => {
    setLoading(true)
    try {
      const res = await apiGetOrders(params)
      setOrders(res.data)
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

  const createOrder = async (orderData: Partial<Order>) => {
    setLoading(true)
    try {
      const newOrder: Order = {
        deliveryDate: orderData.deliveryDate,
        totalAmount: orderData.totalAmount || 0,
        status: orderData.status || OrderStatus.pending,
        paymentStatus: orderData.paymentStatus || PaymentStatus.pending,
        paymentMethod: orderData.paymentMethod || PaymentMethod.cash,
        shippingAddress: orderData.shippingAddress,
        notes: orderData.notes,
        tags: orderData.tags,
        shippingFee: orderData.shippingFee,
        tax: orderData.tax,
        items: orderData.items || [],
        customer: orderData.customer,
        warehouse: orderData.warehouse,
      }
      await apiCreateOrder(newOrder)
      await fetchOrders(apiParams)
    } catch (e) {
      console.error(e)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotAdd"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders when params change
  useEffect(() => {
    fetchOrders(apiParams)
  }, [apiParams])

  useEffect(() => {
    const onInit = async () => {
      try {
        const [cus, wh] = await Promise.all([getCustomers({ status: CustomerStatus.active }), getWarehouses({status: WarehouseStatus.active })])
        setAllCustomers(cus.data)
        setAllWarehouses(wh.data)
      } catch (e) {
        console.error(e)
      }
    }
    onInit()
  }, [])

  return {
    orders,
    total,
    totalPages,
    loading,
    allCustomers,
    allWarehouses,
    showNewOrderModal,
    showFilterModal,
    searchTerm,
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    activeFiltersCount,
    setShowNewOrderModal,
    setShowFilterModal,
    setSearchTerm,
    setPageSize,
    handleSort,
    handlePageChange,
    handleFiltersChange,
    createOrder,
  }
}
