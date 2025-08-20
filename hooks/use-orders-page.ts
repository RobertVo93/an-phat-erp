import { useState, useMemo, useEffect } from "react"
import type { OrderFilters, OrderSortBy } from "@/types/order"
import { CustomerStatus, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { Customer, Order, Warehouse } from "@/types"
import { getWarehouses } from "@/lib/httpclient/warehouse.client"
import { getCustomers } from "@/lib/httpclient/customer.client"
import { getOrders as apiGetOrders, createOrder as apiCreateOrder } from "@/lib/httpclient/order.client"

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export function useOrdersPage() {
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

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
      setOrders([])
      setTotal(0)
      setTotalPages(1)
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (orderData: Partial<Order>) => {
    setLoading(true)
    try {
      const newOrder: Order = {
        id: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        deliveryDate: orderData.deliveryDate,
        totalAmount: orderData.totalAmount || 0,
        status: orderData.status || OrderStatus.pending,
        paymentStatus: orderData.paymentStatus || PaymentStatus.pending,
        paymentMethod: orderData.paymentMethod || PaymentMethod.cash,
        items: orderData.items || [],
        customer: orderData.customer,
        shippingAddress: orderData.shippingAddress,
        notes: orderData.notes,
        tags: orderData.tags,
        shippingFee: orderData.shippingFee,
        tax: orderData.tax,
        warehouse: orderData.warehouse ? {
          ...orderData.warehouse,
          warehouseProducts: orderData.warehouse.warehouseProducts
            ? [...orderData.warehouse.warehouseProducts.map(wp => ({ ...wp }))]
            : []
        } : undefined
      }

      const { createdOrder, updatedOrders } = await apiCreateOrder(newOrder)

      // change warehouse stock
      for (const item of newOrder.items!) {
        const productId = item.product?.id
        const quantityToDeduct = item.quantity ?? 0
        if (!productId || quantityToDeduct <= 0) continue

        const targetWP = newOrder.warehouse?.warehouseProducts?.find(
          wp => wp.product?.id === productId && (wp.quantity ?? 0) >= quantityToDeduct
        )

        if (targetWP) {
          targetWP.quantity! -= quantityToDeduct
        }
      }

      // update orders
      const affectedOrderIds = new Set<string>([
        createdOrder.id,
        ...(updatedOrders || []).map((o: Order) => o.id),
      ])

      setOrders(prev => {
        const filtered = prev.filter(order => !affectedOrderIds.has(order.id!))
        return [createdOrder, ...(updatedOrders || []), ...filtered]
      })
    } catch (e) {
      console.error(e)
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
        const [cus, wh] = await Promise.all([getCustomers({ status: CustomerStatus.active }), getWarehouses()])
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
