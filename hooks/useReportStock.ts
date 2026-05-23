"use client"

import { getProducts } from "@/lib/httpclient"
import { getAllStockChanges } from "@/lib/httpclient/stock-change.client"
import { getCurrentWeekRange } from "@/lib/utils"
import { Product, ProductStatus, ReportPeriod, ReportViewMode, StockChange, StockChangeStatus } from "@/types"
import { IReportStock, ReportStockFilter } from "@/types/report-stock.interface"
import { useEffect, useState } from "react"
import { isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { useLanguage } from "@/contexts/language-context"
import { enUS, vi, Locale } from "date-fns/locale"

interface ISummary {
  activeNumber: number
  lowStockNumber: number
  outOfStockNumer: number
  totalValue: number
}

type ChartData = {
  label: string
  in: number
  out: number
}

export function useReportStock() {
  const { language } = useLanguage()
  const [locale, setLocale] = useState<Locale>(enUS)
  const [loading, setLoading] = useState<boolean>(false)
  const [rawStockChangeRecords, setRawStockChangeRecords] = useState<StockChange[]>([])
  const [formattedStockChanges, setFormattedStockChanges] = useState<IReportStock[]>([])
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filter, setFilter] = useState<ReportStockFilter>({
    dateFrom: new Date(),
    dateTo: new Date()
  })
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(ReportPeriod.day)
  const [viewMode, setViewMode] = useState<ReportViewMode>(ReportViewMode.table)
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [summary, setSummary] = useState<ISummary>({
    activeNumber: 0,
    lowStockNumber: 0,
    outOfStockNumer: 0,
    totalValue: 0
  })
  // const [chartData, setChartData] = useState<ChartData[]>([])

  function filterStockChanges(
    data: IReportStock[],
    dateFrom: Date,
    dateTo: Date,
    period: ReportPeriod,
    selectedProducts?: Product[]
  ): IReportStock[] {
    const selectedProductIds = selectedProducts?.map(p => p.id) ?? [];

    return data.filter((row) => {
      if (!row.date) return false;

      if (selectedProductIds.length > 0 && !selectedProductIds.includes(row.productId)) {
        return false;
      }

      try {
        const rawDate = new Date(row.date);
        let rowDate: Date;

        switch (period) {
          case ReportPeriod.day:
            rowDate = rawDate;
            return isWithinInterval(rowDate, { start: dateFrom, end: dateTo });

          case ReportPeriod.month:
            rowDate = new Date(rawDate.getFullYear(), rawDate.getMonth(), 1);
            return isWithinInterval(rowDate, {
              start: startOfMonth(dateFrom),
              end: endOfMonth(dateTo)
            });

          case ReportPeriod.year:
            rowDate = new Date(rawDate.getFullYear(), 0, 1);
            return isWithinInterval(rowDate, {
              start: startOfYear(dateFrom),
              end: endOfYear(dateTo)
            });

          default:
            return false;
        }
      } catch (err) {
        console.error(`Filter failed for date: ${row.date}`, err);
        return false;
      }
    });
  }

  function formatStockChangesToReportRows(stockChanges: StockChange[]): IReportStock[] {
    return stockChanges.flatMap((stockChange) => {
      if (!stockChange.stockProducts) return []

      return stockChange.stockProducts.map((stockProduct) => {
        const product = stockProduct.product

        return {
          productId: product?.id || "",
          productName: product?.name || "",
          quantity: stockProduct.quantity || 0,
          unit: product?.unit || "",
          totalCost: stockProduct.totalCost || 0,
          type: stockChange.type || "",
          date: stockChange.date || new Date(0),
        } as IReportStock
      })
    })
  }

  const onInit = async () => {
    try {
      setLoading(true)
      const response = await getAllStockChanges()

      setRawStockChangeRecords(response.data as StockChange[])

      const completedStockChanges = (response.data as StockChange[]).filter((stockChange) => stockChange.status === StockChangeStatus.completed)
      setFormattedStockChanges(formatStockChangesToReportRows(completedStockChanges))

      const productResponse = await getProducts()
      const products = productResponse.data as Product[]

      const activeProductList = products.filter((pro) => pro.status === ProductStatus.active)
      const lowStockProductList = products.filter((pro) => (pro.stock! !== 0 && pro.stock! < pro.minStock!))
      const outOfStockProductList = products.filter((pro) => (pro.stock === 0))
      const totalValue = products.reduce((sum, product) => { return sum + (product.stock! * product.price!) }, 0)

      setActiveProducts(activeProductList)
      setSummary({
        activeNumber: activeProductList.length,
        lowStockNumber: lowStockProductList.length,
        outOfStockNumer: outOfStockProductList.length,
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
    activeProducts,
    data: filterStockChanges(formattedStockChanges, filter.dateFrom, filter.dateTo, reportPeriod, filter.products!),
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