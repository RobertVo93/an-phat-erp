"use client"

import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { createOrder as apiCreateOrder } from "@/lib/httpclient/order.client"
import type { IOrderPageData } from "@/lib/services/orderPageService"
import type { Order, OrderFilters, OrderSortBy } from "@/types"
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/types/enums"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, useTransition } from "react"

const FILTER_QUERY_KEYS: Array<keyof Pick<
  OrderFilters,
  "status" | "paymentStatus" | "paymentMethod" | "customer" | "dateFrom" | "dateTo" | "totalAmountFrom" | "totalAmountTo"
>> = [
  "status",
  "paymentStatus",
  "paymentMethod",
  "customer",
  "dateFrom",
  "dateTo",
  "totalAmountFrom",
  "totalAmountTo",
]

type QueryValue = string | number | undefined

export function useOrdersPage(initialData: IOrderPageData) {
  const { t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isCreating, setIsCreating] = useState(false)
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState(initialData.filters.searchTerm ?? "")

  const updateUrl = (
    updates: Record<string, QueryValue>,
    options: { replace?: boolean; clearKeys?: string[] } = {},
  ) => {
    const params = new URLSearchParams(searchParams.toString())

    options.clearKeys?.forEach((key) => params.delete(key))
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    const query = params.toString()
    const href = query ? `${pathname}?${query}` : pathname

    startTransition(() => {
      if (options.replace) {
        router.replace(href, { scroll: false })
      } else {
        router.push(href, { scroll: false })
      }
    })
  }

  useEffect(() => {
    const currentSearchTerm = searchParams.get("searchTerm") ?? ""
    if (searchTerm === currentSearchTerm) return

    const timeout = window.setTimeout(() => {
      updateUrl(
        {
          searchTerm: searchTerm.trim() || undefined,
          page: 1,
        },
        { replace: true },
      )
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [searchTerm, searchParams])

  const activeFiltersCount = useMemo(
    () => FILTER_QUERY_KEYS.filter((key) => {
      const value = initialData.filters[key]
      return value !== undefined && value !== "" && value !== null
    }).length,
    [initialData.filters],
  )

  const handleSort = (field: OrderSortBy) => {
    updateUrl({
      sortBy: field,
      sortOrder: initialData.sortBy === field && initialData.sortOrder === "desc" ? "asc" : "desc",
      page: 1,
    })
  }

  const handlePageChange = (page: number) => {
    updateUrl({ page })
  }

  const handlePageSizeChange = (pageSize: number) => {
    updateUrl({ limit: pageSize, page: 1 })
  }

  const handleFiltersChange = (newFilters: OrderFilters) => {
    const updates = FILTER_QUERY_KEYS.reduce<Record<string, QueryValue>>((result, key) => {
      const value = newFilters[key]
      result[key] = value === "all" ? undefined : value
      return result
    }, { page: 1 })

    updateUrl(updates, { clearKeys: FILTER_QUERY_KEYS })
  }

  const createOrder = async (orderData: Partial<Order>) => {
    setIsCreating(true)
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
        customer: { id: orderData.customer?.id },
        warehouse: { id: orderData.warehouse?.id },
      }
      await apiCreateOrder(newOrder)
      startTransition(() => router.refresh())
    } catch (error) {
      console.error(error)
      toast({
        title: t("common.error.title"),
        description: t("common.error.cannotAdd"),
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return {
    orders: initialData.orders,
    total: initialData.total,
    totalPages: initialData.totalPages,
    loading: isPending || isCreating,
    allWarehouses: initialData.warehouses,
    showNewOrderModal,
    showFilterModal,
    searchTerm,
    filters: initialData.filters,
    currentPage: initialData.currentPage,
    pageSize: initialData.pageSize,
    sortBy: initialData.sortBy,
    sortOrder: initialData.sortOrder,
    activeFiltersCount,
    setShowNewOrderModal,
    setShowFilterModal,
    setSearchTerm,
    setPageSize: handlePageSizeChange,
    handleSort,
    handlePageChange,
    handleFiltersChange,
    createOrder,
  }
}
