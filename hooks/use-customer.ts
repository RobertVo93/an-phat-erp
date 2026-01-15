import { getCustomerById } from "@/lib/httpclient";
import { Customer, Order, OrderFilters, OrderSortBy } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { getOrders as apiGetOrders } from "@/lib/httpclient/order.client"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/contexts/language-context";

export const useCustomer = (id: string) => {
  const { t } = useLanguage()
  const [loading, setLoading] = useState<boolean>(false)
  const [notFoundError, setNotFoundError] = useState(false);
  const [customer, setCustomer] = useState<Customer>()
  const [orders, setOrders] = useState<Order[]>([])

  // pagination
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<OrderSortBy>("deliveryDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

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
      limit: 10,
      sortBy,
      sortOrder,
    }
  }, [currentPage, sortBy, sortOrder])

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
    sortBy,
    sortOrder,

    handlePageChange,
    handleSort
  }
}