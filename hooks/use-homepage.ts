"use client"

import { useEffect, useMemo, useState } from "react"
import { Product, Warehouse, ProductionRecord, Customer, Order, OrderFilters, ProductFormData, Collection, Employee, Utility } from "@/types"
import { CollectionStatus, EmployeeStatus, OrderStatus, ProductStatus, UtilityStatus, WarehouseStatus } from "@/types/enums"
import {
    getProducts as apiGetProducts, 
    getWarehouses as apiGetWarehouses, 
    getAllProductions as apiGetAllProductions,
    getOrders as apiGetOrders,
    createProduct as apiCreateProduct,
    createOrder as apiCreateOrder,
    createProduction as apiCreateProduction,
    createCustomer as apiCreateCustomer,
    getCollections,
    getUtilitiesByFilterClient,
    getEmployee,
} from "@/lib/httpclient"
import { sameDayLastYear, sameDayLastMonth, startOfMonthLike, formatYYYYMMDD, getNextDay } from "@/lib/utils"

export interface SummaryTriple {
  current: number
  lastMonth: number
  lastYear: number
}

export interface HeaderStats {
  revenue: SummaryTriple
  orders: SummaryTriple
  orderedCustomers: SummaryTriple
  producedProducts: SummaryTriple
}

export interface HomepageState {
  // header
  stats: HeaderStats | null
  // recent orders table
  recentOrders: Order[]
  totalRecentOrders: number
  totalRecentPages: number
  recentPage: number
  pageSize: number
  loadingRecent: boolean
  loadingStats: boolean
  creatingProduct: boolean
  creatingOrder: boolean
  creatingProduction: boolean
  creatingCustomer: boolean

  // quick action modals
  showOrderModal: boolean
  showCustomerModal: boolean
  showProductModal: boolean
  showProductionModal: boolean
  // references
  allWarehouses: Warehouse[]
  allCollectionsLoaded: boolean
  availableProducts: Product[]
  allCollections: Collection[]
  allUtilities: Utility[]
  allEmployees: Employee[]
}

export function useHomepage() {
  const [state, setState] = useState<HomepageState>({
    stats: null,
    recentOrders: [],
    totalRecentOrders: 0,
    totalRecentPages: 0,
    recentPage: 1,
    pageSize: 10,
    loadingRecent: false,
    loadingStats: false,
    creatingProduct: false,
    creatingOrder: false,
    creatingProduction: false,
    creatingCustomer: false,
    showOrderModal: false,
    showCustomerModal: false,
    showProductModal: false,
    showProductionModal: false,
    allWarehouses: [],
    allCollectionsLoaded: false,
    availableProducts: [],
    allCollections: [],
    allUtilities: [],
    allEmployees: [],
  })

  // Compute date windows per requirement
  const dateWindows = useMemo(() => {
    const today = getNextDay()
    const currentStart = startOfMonthLike(today)
    const lastMonthSameDay = sameDayLastMonth(today)
    const lastMonthStart = startOfMonthLike(lastMonthSameDay)
    const lastYearSameDay = sameDayLastYear(today)
    const lastYearStart = startOfMonthLike(lastYearSameDay)

    return {
      current: { from: currentStart, to: today },
      lastMonth: { from: lastMonthStart, to: lastMonthSameDay },
      lastYear: { from: lastYearStart, to: lastYearSameDay },
    }
  }, [])

  const fetchRecentOrders = async (page: number) => {
    setState(prev => ({ ...prev, loadingRecent: true }))
    try {
      const params: OrderFilters = {
        page,
        limit: state.pageSize,
        sortBy: "deliveryDate",
        sortOrder: "desc",
        status: OrderStatus.completed, // will be overridden below; we want uncompleted orders
      }

      // Uncompleted: everything except completed and cancelled
      // Since API supports only equality filters, we fetch pending/processing/shipped/delivered and merge
      const statuses: string[] = [
        OrderStatus.pending,
        OrderStatus.processing,
        OrderStatus.shipped,
        OrderStatus.delivered,
      ]

      const results = await Promise.all(statuses.map(s => apiGetOrders({ ...params, status: s })))

      const mergedData: Order[] = results.flatMap(r => r.data as Order[])
      const total = results.reduce((sum, r) => sum + (r.total as number), 0)
      const totalPages = Math.max(...results.map(r => Math.ceil((r.total as number) / (state.pageSize || 10))), 1)

      setState(prev => ({
        ...prev,
        recentOrders: mergedData,
        totalRecentOrders: total,
        totalRecentPages: totalPages,
        recentPage: page,
      }))
    } finally {
      setState(prev => ({ ...prev, loadingRecent: false }))
    }
  }

  const computeHeaderStats = async () => {
    setState(prev => ({ ...prev, loadingStats: true }))
    // Pull orders and productions once for each window
    const toFilter = (from: Date, to: Date): OrderFilters => ({
      dateFrom: formatYYYYMMDD(from),
      dateTo: formatYYYYMMDD(to),
      limit: 1000,
      page: 1,
      sortBy: "deliveryDate",
      sortOrder: "desc",
    })

    const fetchWindowData = async (from: Date, to: Date) => {
      const [ordersRes, productionsRes] = await Promise.all([
        apiGetOrders({ ...toFilter(from, to) }),
        apiGetAllProductions(),
      ])

      const orders = ordersRes.data as Order[]
      const productions = (productionsRes.data as ProductionRecord[]).filter(rec => {
        const d = rec.date ? new Date(rec.date) : null
        if (!d) return false
        return d >= from && d <= to
      })

      const completedOrders = orders.filter(o => o.totalAmount && o.totalAmount > 0)
      const revenue = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      const uniqueCustomers = new Set<string>(orders.map(o => o.customer?.id || "").filter(Boolean))
      const producedProducts = productions.reduce((sum, p) => sum + (p.quantity || 0), 0)

      return { revenue, ordersCount: orders.length, customersCount: uniqueCustomers.size, producedProducts }
    }

    const { current, lastMonth, lastYear } = dateWindows
    const [cw, lm, ly] = await Promise.all([
      fetchWindowData(current.from, current.to),
      fetchWindowData(lastMonth.from, lastMonth.to),
      fetchWindowData(lastYear.from, lastYear.to),
    ])

    const stats: HeaderStats = {
      revenue: { current: cw.revenue, lastMonth: lm.revenue, lastYear: ly.revenue },
      orders: { current: cw.ordersCount, lastMonth: lm.ordersCount, lastYear: ly.ordersCount },
      orderedCustomers: { current: cw.customersCount, lastMonth: lm.customersCount, lastYear: ly.customersCount },
      producedProducts: { current: cw.producedProducts, lastMonth: lm.producedProducts, lastYear: ly.producedProducts },
    }

    setState(prev => ({ ...prev, stats, loadingStats: false }))
  }

  const initReferences = async () => {
    const [warehousesRes, productsRes, collectionsRes, utilitiesRes, employeesRes] = await Promise.all([
      apiGetWarehouses({ status: WarehouseStatus.active }),
      apiGetProducts({ status: ProductStatus.active, limit: 1000, page: 1 }),
      getCollections({ status: CollectionStatus.active, limit: 1000, page: 1 }),
      getUtilitiesByFilterClient({ status: UtilityStatus.active, limit: 1000, page: 1 }),
      getEmployee({
        status: EmployeeStatus.active,
        limit: 1000,
        page: 1,
      }),
    ])
    setState(prev => ({
      ...prev,
      allWarehouses: warehousesRes.data as Warehouse[],
      availableProducts: productsRes.data as Product[],
      allCollections: collectionsRes.data as Collection[],
      allUtilities: utilitiesRes.data as Utility[],
      allEmployees: employeesRes.data as Employee[],
    }))
  }

  useEffect(() => {
    computeHeaderStats()
    initReferences()
    fetchRecentOrders(1)
  }, [])


  // handlers for new entities
  const handleCreateProduct = async (data: ProductFormData) => {
    setState(prev => ({ ...prev, creatingProduct: true }))
    try {
      await apiCreateProduct(data)
    } finally {
      setState(prev => ({ ...prev, creatingProduct: false }))
    }
  }

  const handleCreateOrder = async (data: Order) => {
    setState(prev => ({ ...prev, creatingOrder: true }))
    try {
      await apiCreateOrder({...data, customer: {id: data.customer?.id}, warehouse: {id: data.warehouse?.id}})
      computeHeaderStats()
      fetchRecentOrders(1)
    } finally {
      setState(prev => ({ ...prev, creatingOrder: false }))
    }
  }

  const handleCreateProduction = async (data: ProductionRecord) => {
    setState(prev => ({ ...prev, creatingProduction: true }))
    try {
      await apiCreateProduction(data)
      computeHeaderStats()
    } finally {
      setState(prev => ({ ...prev, creatingProduction: false, showProductionModal: false }))
    }
  }

  const handleCreateCustomer = async (data: Customer) => {
    setState(prev => ({ ...prev, creatingCustomer: true }))
    try {
      await apiCreateCustomer(data)
    } finally {
      setState(prev => ({ ...prev, creatingCustomer: false }))
    }
  }

  return {
    // header
    stats: state.stats,
    dateWindows,

    // recent orders table
    recentOrders: state.recentOrders,
    totalRecentOrders: state.totalRecentOrders,
    totalRecentPages: state.totalRecentPages,
    recentPage: state.recentPage,
    pageSize: state.pageSize,
    loadingRecent: state.loadingRecent,
    fetchRecentOrders,

    // quick actions
    showOrderModal: state.showOrderModal,
    showCustomerModal: state.showCustomerModal,
    showProductModal: state.showProductModal,
    showProductionModal: state.showProductionModal,
    setShowOrderModal: (open: boolean) => setState(prev => ({ ...prev, showOrderModal: open })),
    setShowCustomerModal: (open: boolean) => setState(prev => ({ ...prev, showCustomerModal: open })),
    setShowProductModal: (open: boolean) => setState(prev => ({ ...prev, showProductModal: open })),
    setShowProductionModal: (open: boolean) => setState(prev => ({ ...prev, showProductionModal: open })),

    // refs for modals
    allWarehouses: state.allWarehouses,
    availableProducts: state.availableProducts,
    allCollections: state.allCollections,
    allUtilities: state.allUtilities,
    allEmployees: state.allEmployees,
    creatingProduct: state.creatingProduct,
    creatingOrder: state.creatingOrder,
    creatingProduction: state.creatingProduction,
    creatingCustomer: state.creatingCustomer,
    loadingStats: state.loadingStats,
    isLoading: state.creatingProduct || state.creatingOrder || state.creatingProduction || state.creatingCustomer,
    handleCreateProduct,
    handleCreateOrder,
    handleCreateProduction,
    handleCreateCustomer,
  }
}


