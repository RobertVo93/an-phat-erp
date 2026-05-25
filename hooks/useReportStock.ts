"use client"

import { getAllProductsByFilter } from "@/lib/httpclient"
import { getAllStockChangeByFilter } from "@/lib/httpclient/stock-change.client"
import { formatYYYYMMDD, getCurrentWeekRange, getIntervalForPeriod } from "@/lib/utils"
import { Product, ProductStatus, ProductUnit, ReportPeriod, StockChange, StockChangeStatus } from "@/types"
import { IReportStock, ReportStockFilter, StockReportSummary } from "@/types/report-stock.interface"
import { useEffect, useMemo, useState } from "react"

export function useReportStock() {
  const [defaultDateFrom, defaultDateTo] = getCurrentWeekRange()
  const [loading, setLoading] = useState<boolean>(false)
  const [formattedStockChanges, setFormattedStockChanges] = useState<IReportStock[]>([])
  const [filter, setFilter] = useState<ReportStockFilter>({
    dateFrom: defaultDateFrom,
    dateTo: defaultDateTo,
  })
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(ReportPeriod.day)
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const selectedProductIdsSet = useMemo(
    () => new Set((filter.products ?? []).map((item) => item.id).filter(Boolean)),
    [filter.products],
  )

  function formatStockChangesToReportRows(stockChanges: StockChange[]): IReportStock[] {
    return stockChanges.flatMap((stockChange) => {
      if (!stockChange.stockProducts) return []
      const reportDate = stockChange.date ? new Date(stockChange.date) : new Date(0)

      return stockChange.stockProducts.map((stockProduct) => {
        const row: IReportStock = {
          stockChangeId: stockChange.id,
          productId: stockProduct.id || "",
          productName: stockProduct.name || "",
          quantity: stockProduct.quantity || 0,
          unit: stockProduct.unit as ProductUnit,
          totalCost: stockProduct.totalCost || 0,
          type: stockChange.type,
          date: reportDate,
          isProductionRelated: !!stockChange.productionRecord
        }
        return row
      })
    })
  }

  // change date range
  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return
    setFilter((prev) => ({
      ...prev,
      dateFrom: range.from ?? prev.dateFrom,
      dateTo: range.to ?? prev.dateTo,
    }))
  }

  useEffect(() => {
    const initProducts = async () => {
      try {
        const products = await getAllProductsByFilter({ status: ProductStatus.active })
        setActiveProducts(products)
      } catch (error) {
        console.error(error)
      }
    }

    initProducts()
  }, [])

  useEffect(() => {
    let isCancelled = false
    const interval = getIntervalForPeriod(filter.dateFrom, filter.dateTo, reportPeriod)

    const fetchFilteredStockChanges = async () => {
      try {
        setLoading(true)

        const rows = await getAllStockChangeByFilter({
          sortBy: "date",
          sortOrder: "asc",
          status: StockChangeStatus.completed,
          dateFrom: formatYYYYMMDD(interval.from),
          dateTo: formatYYYYMMDD(interval.to),
        })
        if (!isCancelled) {
          setFormattedStockChanges(formatStockChangesToReportRows(rows))
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    const timer = setTimeout(fetchFilteredStockChanges, 200)
    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [filter.dateFrom, filter.dateTo, reportPeriod])

  const filteredData = useMemo(() => {
    return formattedStockChanges.filter((row) => {
      if (!row.date) return false
      if (selectedProductIdsSet.size > 0 && !selectedProductIdsSet.has(row.productId)) return false
      return true
    })
  }, [formattedStockChanges, selectedProductIdsSet])

  const summary = useMemo<StockReportSummary>(() => {
    const scopedProducts =
      selectedProductIdsSet.size === 0
        ? activeProducts
        : activeProducts.filter((product) => product.id && selectedProductIdsSet.has(product.id))

    const lowStockProductList = scopedProducts.filter((pro) => (pro.stock ?? 0) !== 0 && (pro.stock ?? 0) < (pro.minStock ?? 0))
    const outOfStockProductList = scopedProducts.filter((pro) => (pro.stock ?? 0) === 0)
    const totalValue = scopedProducts.reduce((sum, product) => sum + (product.stock ?? 0) * (product.price ?? 0), 0)

    return {
      activeNumber: scopedProducts.length,
      lowStockNumber: lowStockProductList.length,
      outOfStockNumber: outOfStockProductList.length,
      totalValue,
    }
  }, [activeProducts, selectedProductIdsSet])

  return {
    loading,
    filter,
    activeProducts,
    data: filteredData,
    reportPeriod,
    summary,

    setReportPeriod,
    setFilter,
    handleDateRangeChange
  }
}
