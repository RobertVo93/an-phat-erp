"use client"

import { getProducts, getAllProductions } from "@/lib/httpclient"
import { 
  calcGrowth,
  formatYYYYMMDD, 
  getEndOfMonth, 
  getIntervalForPeriod, 
  getPeriodGroupingKey, 
  getStartOfMonth, 
  parsePeriodGroupingKey, 
  shiftDateByPeriod 
} from "@/lib/utils"
import {
  Product,
  ProductionRecord,
  ProductionStatus,
  ProductStatus,
  ReportPeriod,
  ProductionComparisonChartDataset,
  ProductionMetricKey,
  ProductionProductPerformance,
  ReportProductionFilter,
  ProductionReportRow,
  ProductionSummary,
} from "@/types"
import { isWithinInterval } from "date-fns"
import { useEffect, useMemo, useState } from "react"

type RevenueTotals = {
  revenue: number
  cost: number
  profit: number
}

type NormalizedRecord = RevenueTotals & {
  date: Date
  productId: string | undefined
  productName: string
  quantity: number
}

export function useProductionReport() {
  const [loading, setLoading] = useState<boolean>(false)
  const [rawRecords, setRawRecords] = useState<ProductionRecord[]>([])
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(ReportPeriod.month)
  const [filter, setFilter] = useState<ReportProductionFilter>({
    dateFrom: getStartOfMonth(new Date()),
    dateTo: getEndOfMonth(new Date()),
  })

  useEffect(() => {
    const initProducts = async () => {
      try {
        const productsResponse = await getProducts({ status: ProductStatus.active })
        setActiveProducts(productsResponse.data ?? [])
      } catch (error) {
        console.error(error)
      }
    }

    initProducts()
  }, [])

  const selectedProductIds = useMemo(() => new Set((filter.products ?? []).map((item) => item.id)), [filter.products])

  const selectedProductsKey = useMemo(
    () => (filter.products ?? []).map((item) => item.id).filter(Boolean).sort().join(","),
    [filter.products],
  )

  useEffect(() => {
    let isCancelled = false
    const interval = getIntervalForPeriod(filter.dateFrom, filter.dateTo, reportPeriod)
    const selectedProductIdsArray = selectedProductsKey ? selectedProductsKey.split(",") : []
    const serverProductFilter =
      selectedProductIdsArray.length === 1 ? selectedProductIdsArray[0] : undefined

    const fetchFilteredProductions = async () => {
      try {
        setLoading(true)

        const limit = 200
        let page = 1
        let allRows: ProductionRecord[] = []
        let total = 0

        do {
          const response = await getAllProductions({
            page,
            limit,
            sortBy: "date",
            sortOrder: "asc",
            status: ProductionStatus.completed,
            dateFrom: formatYYYYMMDD(interval.from),
            dateTo: formatYYYYMMDD(interval.to),
            product: serverProductFilter,
          })

          const pageRows = (response.data as ProductionRecord[]) ?? []
          total = Number(response.total ?? 0)
          allRows = allRows.concat(pageRows)
          page += 1
        } while ((page - 1) * limit < total)

        if (!isCancelled) {
          setRawRecords(allRows)
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

    const timer = setTimeout(fetchFilteredProductions, 200)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [filter.dateFrom, filter.dateTo, reportPeriod, selectedProductsKey])

  const allCompletedRecords = useMemo<NormalizedRecord[]>(
    () =>
      rawRecords
        .map((record) => {
          if (!record.date || !record.product?.name || !record.quantity) return null

          const recordDate = new Date(record.date)
          if (Number.isNaN(recordDate.getTime())) return null

          const revenue = record.totalCost ?? 0
          const cost = record.totalExpense ?? 0

          return {
            date: recordDate,
            productId: record.product.id,
            productName: record.product.name,
            quantity: record.quantity,
            revenue,
            cost,
            profit: revenue - cost,
          }
        })
        .filter((record): record is NormalizedRecord => Boolean(record)),
    [rawRecords],
  )

  const currentInterval = useMemo(
    () => getIntervalForPeriod(filter.dateFrom, filter.dateTo, reportPeriod),
    [filter.dateFrom, filter.dateTo, reportPeriod],
  )

  const recordMatchesProductFilter = (record: NormalizedRecord): boolean => {
    if (selectedProductIds.size === 0) return true
    if (!record.productId) return false
    return selectedProductIds.has(record.productId)
  }

  const filteredRecords = useMemo(() => {
    return allCompletedRecords
      .filter((record) => recordMatchesProductFilter(record))
      .filter((record) =>
        isWithinInterval(record.date, { start: currentInterval.from, end: currentInterval.to }),
      )
  }, [allCompletedRecords, currentInterval.from, currentInterval.to, selectedProductIds])

  const derivedData = useMemo(() => {
    const groupedProduction = new Map<string, ProductionReportRow>()
    const groupedProducts = new Map<string, ProductionProductPerformance>()
    const summaryTotals: RevenueTotals = { revenue: 0, cost: 0, profit: 0 }

    for (const record of filteredRecords) {
      summaryTotals.revenue += record.revenue
      summaryTotals.cost += record.cost
      summaryTotals.profit += record.profit

      const periodKey = getPeriodGroupingKey(record.date, reportPeriod)
      const currentPeriod = groupedProduction.get(periodKey)
      if (!currentPeriod) {
        groupedProduction.set(periodKey, {
          date: periodKey,
          revenue: record.revenue,
          cost: record.cost,
          profit: record.profit,
          efficiency: record.revenue > 0 ? +((record.profit / record.revenue) * 100).toFixed(1) : 0,
        })
      } else {
        currentPeriod.revenue += record.revenue
        currentPeriod.cost += record.cost
        currentPeriod.profit += record.profit
        currentPeriod.efficiency =
          currentPeriod.revenue > 0 ? +((currentPeriod.profit / currentPeriod.revenue) * 100).toFixed(1) : 0
      }

      const currentProduct = groupedProducts.get(record.productName)
      if (!currentProduct) {
        groupedProducts.set(record.productName, {
          product: record.productName,
          quantity: record.quantity,
          revenue: record.revenue,
          cost: record.cost,
          profit: record.profit,
          margin: record.revenue > 0 ? +((record.profit / record.revenue) * 100).toFixed(1) : 0,
        })
      } else {
        currentProduct.quantity += record.quantity
        currentProduct.revenue += record.revenue
        currentProduct.cost += record.cost
        currentProduct.profit += record.profit
        currentProduct.margin =
          currentProduct.revenue > 0 ? +((currentProduct.profit / currentProduct.revenue) * 100).toFixed(1) : 0
      }
    }

    const productionRows = Array.from(groupedProduction.values())
      .map((row) => ({
        row,
        sortValue: parsePeriodGroupingKey(row.date, reportPeriod).getTime(),
      }))
      .sort((a, b) => a.sortValue - b.sortValue)
      .map((item) => item.row)

    const productRows = Array.from(groupedProducts.values()).sort((a, b) => b.revenue - a.revenue)

    const summaryData: ProductionSummary = {
      revenue: { value: summaryTotals.revenue },
      cost: { value: summaryTotals.cost },
      profit: { value: summaryTotals.profit },
    }

    return {
      productionData: productionRows,
      productPerformanceData: productRows,
      summary: summaryData,
    }
  }, [filteredRecords, reportPeriod])

  const productionData = derivedData.productionData
  const productPerformanceData = derivedData.productPerformanceData
  const summary = derivedData.summary

  const comparisonChartData = useMemo<ProductionComparisonChartDataset[]>(() => {
    const groupedAll = new Map<string, RevenueTotals>()

    for (const record of allCompletedRecords) {
      if (!recordMatchesProductFilter(record)) continue
      const key = getPeriodGroupingKey(record.date, reportPeriod)
      const current = groupedAll.get(key)

      if (!current) {
        groupedAll.set(key, {
          revenue: record.revenue,
          cost: record.cost,
          profit: record.profit,
        })
        continue
      }

      current.revenue += record.revenue
      current.cost += record.cost
      current.profit += record.profit
    }

    const metricConfig: Array<{ metric: ProductionMetricKey; titleKey: string }> = [
      { metric: "revenue", titleKey: "rp.page.totalRevenue" },
      { metric: "cost", titleKey: "rp.page.totalExpense" },
      { metric: "profit", titleKey: "rp.page.totalProfit" },
    ]

    return metricConfig.map(({ metric, titleKey }) => {
      const rows = productionData.map((row) => {
        const currentDate = parsePeriodGroupingKey(row.date, reportPeriod)
        const metricCurrent = row[metric]

        const baselineDate1 = shiftDateByPeriod(currentDate, reportPeriod, -1)
        const baselineKey1 = getPeriodGroupingKey(baselineDate1, reportPeriod)
        const baseline1 = groupedAll.get(baselineKey1)?.[metric] ?? 0

        const metricRow = {
          label: row.date,
          current: metricCurrent,
          baseline1,
          baseline1Percent: calcGrowth(metricCurrent, baseline1),
        }

        if (reportPeriod === ReportPeriod.day) {
          const baselineDate2 = shiftDateByPeriod(currentDate, ReportPeriod.month, -1)
          const baselineDate3 = shiftDateByPeriod(currentDate, ReportPeriod.year, -1)
          const baseline2 = groupedAll.get(getPeriodGroupingKey(baselineDate2, reportPeriod))?.[metric] ?? 0
          const baseline3 = groupedAll.get(getPeriodGroupingKey(baselineDate3, reportPeriod))?.[metric] ?? 0

          return {
            ...metricRow,
            baseline2,
            baseline3,
            baseline2Percent: calcGrowth(metricCurrent, baseline2),
            baseline3Percent: calcGrowth(metricCurrent, baseline3),
          }
        }

        if (reportPeriod === ReportPeriod.month) {
          const baselineDate2 = shiftDateByPeriod(currentDate, ReportPeriod.year, -1)
          const baseline2 = groupedAll.get(getPeriodGroupingKey(baselineDate2, reportPeriod))?.[metric] ?? 0

          return {
            ...metricRow,
            baseline2,
            baseline2Percent: calcGrowth(metricCurrent, baseline2),
          }
        }

        return metricRow
      })

      if (reportPeriod === ReportPeriod.day) {
        return {
          metric,
          titleKey,
          baseline1LabelKey: "rp.page.theDateBefore",
          baseline2LabelKey: "rp.page.samePeriodLastMonth",
          baseline3LabelKey: "rp.page.samePeriodLastYear",
          rows,
        }
      }

      if (reportPeriod === ReportPeriod.month) {
        return {
          metric,
          titleKey,
          baseline1LabelKey: "rp.page.samePeriodLastMonth",
          baseline2LabelKey: "rp.page.samePeriodLastYear",
          rows,
        }
      }

      return {
        metric,
        titleKey,
        baseline1LabelKey: "rp.page.previousPeriod",
        rows,
      }
    })
  }, [allCompletedRecords, productionData, reportPeriod, selectedProductIds])

  const handleDateRangeChange = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) return

    setFilter((prev) => ({
      ...prev,
      dateFrom: range.from ?? prev.dateFrom,
      dateTo: range.to ?? prev.dateTo,
    }))
  }

  return {
    loading,
    filter,
    activeProducts,
    reportPeriod,
    productionData,
    productPerformanceData,
    summary,
    comparisonChartData,
    setFilter,
    setReportPeriod,
    handleDateRangeChange,
  }
}
