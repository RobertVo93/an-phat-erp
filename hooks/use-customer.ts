import { getCustomerById } from "@/lib/httpclient";
import { Customer, Order, OrderFilters, OrderSortBy } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { getOrders as apiGetOrders } from "@/lib/httpclient/order.client"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context";
import type { ICustomerDetailPageData } from "@/lib/services/customerDetailPageService";

export const useCustomer = (id: string, initialData?: ICustomerDetailPageData) => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState<boolean>(false)
  const [notFoundError, setNotFoundError] = useState(false);
  const [customer, setCustomer] = useState<Customer | undefined>(initialData?.customer || undefined)
  const [orders, setOrders] = useState<Order[]>(initialData?.orders || [])

  // pagination
  const [total, setTotal] = useState(initialData?.total || 0)
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1)
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1)
  const [pageSize] = useState(initialData?.pageSize || 10)
  const [sortBy, setSortBy] = useState<OrderSortBy>(initialData?.sortBy || "deliveryDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialData?.sortOrder || "desc")
  const hasHydratedInitialOrders = useRef(Boolean(initialData))

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

  // Build params for API
  const apiParams = useMemo(() => {
    return {
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
    }
  }, [currentPage, pageSize, sortBy, sortOrder])

  // apis
  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const res = await getCustomerById(id)
      setCustomer(res)
    } catch (e) {
      console.error(e)
      setNotFoundError(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async (params: OrderFilters) => {
    setLoading(true)
    try {
      const res = await apiGetOrders(params, id)
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

  useEffect(() => {
    if(!customer) {
      fetchCustomer()
    }
    if (hasHydratedInitialOrders.current) {
      hasHydratedInitialOrders.current = false
      return
    }
    fetchOrders(apiParams)
  }, [apiParams])

  return {
    loading,
    notFoundError,
    customer,
    orders,
    total,
    totalPages,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,

    handlePageChange,
    handleSort
  }
}
