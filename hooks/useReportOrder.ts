"use client"

import { getCurrentWeekRange } from "@/lib/period_utils"
import { CustomerStatus, Customer as ICustomer, IReportOrder, Order as IOrder, ReportOrderFilter, ReportPeriod, ReportViewMode, OrderStatus } from "@/types"
import { useEffect, useState } from "react"
import { isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { useLanguage } from "@/contexts/language-context"
import { enUS, vi, Locale } from "date-fns/locale"
import { getOrders } from "@/lib/httpclient/order.client"
import { getCustomers } from "@/lib/httpclient/customer.client"

interface ISummary {
  totalOrders: number
  statusCompleted: number
  statusPending: number
  totalValue: number
}

export function useReportOrder() {
  const { language } = useLanguage()
  const [locale, setLocale] = useState<Locale>(enUS)
  const [loading, setLoading] = useState<boolean>(false)
  const [formattedOrders, setFormattedOrders] = useState<IReportOrder[]>([])
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filter, setFilter] = useState<ReportOrderFilter>({
    dateFrom: new Date(),
    dateTo: new Date()
  })
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(ReportPeriod.day)
  const [viewMode, setViewMode] = useState<ReportViewMode>(ReportViewMode.table)
  const [activeCustomers, setActiveCustomers] = useState<ICustomer[]>([])
  const [summary, setSummary] = useState<ISummary>({
    totalOrders: 0,
    statusCompleted: 0,
    statusPending: 0,
    totalValue: 0
  })

  function filterOrders(
    data: IReportOrder[],
    filter: ReportOrderFilter,
    period: ReportPeriod,
  ): IReportOrder[] {
    return data.filter((row) => {
      if (!row.deliveryDate) return false;

      try {
        const rawDate = new Date(row.deliveryDate);
        let rowDate: Date;

        switch (period) {
          case ReportPeriod.day:
            rowDate = rawDate;
            return (
              isWithinInterval(rowDate, { start: filter.dateFrom, end: filter.dateTo }) &&
              (!filter.customers?.length ||
                filter.customers.some(customer => customer.id === row.customer?.id)) &&
              (filter.status === undefined || row.status === filter.status) &&
              (filter.paymentMethod === undefined || row.paymentMethod === filter.paymentMethod)
            );

          case ReportPeriod.month:
            rowDate = new Date(rawDate.getFullYear(), rawDate.getMonth(), 1);
            return (
              isWithinInterval(rowDate, {
                start: startOfMonth(filter.dateFrom),
                end: endOfMonth(filter.dateTo)
              }) &&
              (!filter.customers?.length ||
                filter.customers.some(customer => customer.id === row.customer?.id)) &&
              (filter.status === undefined || row.status === filter.status) &&
              (filter.paymentMethod === undefined || row.paymentMethod === filter.paymentMethod)
            );

          case ReportPeriod.year:
            rowDate = new Date(rawDate.getFullYear(), 0, 1);
            return (
              isWithinInterval(rowDate, {
                start: startOfYear(filter.dateFrom),
                end: endOfYear(filter.dateTo)
              }) &&
              (!filter.customers?.length ||
                filter.customers.some(customer => customer.id === row.customer?.id)) &&
              (filter.status === undefined || row.status === filter.status) &&
              (filter.paymentMethod === undefined || row.paymentMethod === filter.paymentMethod)
            );

          default:
            return false;
        }
      } catch (err) {
        console.error(`Filter failed for date: ${row.deliveryDate}`, err);
        return false;
      }
    });
  }

  function formatOrdersToReportRows(orders: IOrder[]): IReportOrder[] {
    return orders.map((order) => {
      return {
        number: order.number,
        customer: order.customer,
        deliveryAddress: order.shippingAddress,
        status: order.status,
        deliveryDate: order.deliveryDate,
        tag: order.tags,
        paymentMethod: order.paymentMethod,
        note: order.notes,
        totalPrice: order.totalAmount,
        orderDate: order.createdAt,
      } as IReportOrder
    })
  }

  const onInit = async () => {
    try {
      setLoading(true)
      const orderResponse = await getOrders()
      const orderData = orderResponse.data as IOrder[]
      setFormattedOrders(formatOrdersToReportRows(orderData))

      const customerResponse = await getCustomers()
      const activeCustomerList = (customerResponse.data as ICustomer[]).filter((cus) => cus.status === CustomerStatus.active)
      setActiveCustomers(activeCustomerList)

      const completedOrders = orderData.filter((order) => order.status === OrderStatus.completed)
      const pendingOrders = orderData.filter((order) => order.status === OrderStatus.pending)
      const totalValue = completedOrders.reduce((sum, val) => (sum + val.totalAmount!), 0)
      setSummary({
        totalOrders: orderData.length,
        statusCompleted: completedOrders.length,
        statusPending: pendingOrders.length,
        totalValue: totalValue
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // change date range
  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return
    setFilter(prev => ({
      ...prev,
      dateFrom: range.from ?? prev.dateFrom,
      dateTo: range.to ?? prev.dateTo
    }))
  }

  useEffect(() => {
    onInit()
    const [mon, sun] = getCurrentWeekRange()
    setFilter({ ...filter, dateFrom: mon, dateTo: sun })
  }, [])

  useEffect(() => {
    language === "vi" ? setLocale(vi) : setLocale(enUS)
  }, [language])

  return {
    loading,
    showFilterModal,
    filter,
    activeCustomers,
    data: filterOrders(formattedOrders, filter, reportPeriod) ?? [],
    viewMode,
    reportPeriod,
    summary,
    locale,

    setViewMode,
    setReportPeriod,
    setFilter,
    setShowFilterModal,
    handleDateRangeChange
  }
}