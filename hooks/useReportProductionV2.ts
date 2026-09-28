"use client"

import { getAllProductions, getProducts } from "@/lib/httpclient"
import {
  formatYYYYMMDD,
  getIntervalForPeriod,
  getOneYearFromProvidedDate,
  getPeriodGroupingKey,
} from "@/lib/utils"
import {
  Product,
  ProductStatus,
  ProductionRecord,
  ProductionStatus,
  ReportPeriod,
} from "@/types"
import {
  IProductionMetricComparisonV2,
  IProductionMonthlyComparisonRowV2,
  IProductionReportPeriodLabelsV2,
  IProductionSummaryV2,
  IReportProductionFilterV2,
} from "@/types/report-production-v2.interface"
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  startOfMonth,
  subYears,
} from "date-fns"
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"

const REPORT_PERIOD = ReportPeriod.month
const PRODUCTION_PAGE_SIZE = 200
const PRODUCT_PAGE_SIZE = 1000

interface IRevenueTotals {
  revenue: number
  cost: number
  profit: number
}

interface INormalizedRecord extends IRevenueTotals {
  date: Date
  productId?: string
}

interface IDateInterval {
  from: Date
  to: Date
}

interface IDateRange {
  from?: Date
  to?: Date
}

interface IUseProductionReportV2Result {
  loading: boolean
  hasError: boolean
  hasData: boolean
  filter: IReportProductionFilterV2
  activeProducts: Product[]
  summary: IProductionSummaryV2
  comparisonData: IProductionMonthlyComparisonRowV2[]
  periodLabels: IProductionReportPeriodLabelsV2
  setFilter: Dispatch<SetStateAction<IReportProductionFilterV2>>
  handleDateRangeChange: (range: IDateRange | undefined) => void
}

const EMPTY_TOTALS: IRevenueTotals = {
  revenue: 0,
  cost: 0,
  profit: 0,
}

function getPreviousYearInterval(interval: IDateInterval): IDateInterval {
  return {
    from: startOfMonth(subYears(interval.from, 1)),
    to: endOfMonth(subYears(interval.to, 1)),
  }
}

function sumRecords(records: INormalizedRecord[]): IRevenueTotals {
  return records.reduce<IRevenueTotals>(
    (totals, record) => ({
      revenue: totals.revenue + record.revenue,
      cost: totals.cost + record.cost,
      profit: totals.profit + record.profit,
    }),
    { ...EMPTY_TOTALS },
  )
}

function calculateChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return +(((current - previous) / Math.abs(previous)) * 100).toFixed(1)
}

function calculateEfficiency(revenue: number, cost: number): number | null {
  if (revenue <= 0) return null
  return +(((revenue - cost) / revenue) * 100).toFixed(1)
}

function createMetricComparison(
  currentValue: number,
  previousValue: number,
): IProductionMetricComparisonV2 {
  return {
    currentValue,
    previousValue,
    changePercentage: calculateChange(currentValue, previousValue),
  }
}

function createSummary(current: IRevenueTotals, previous: IRevenueTotals): IProductionSummaryV2 {
  return {
    revenue: {
      value: current.revenue,
      previousValue: previous.revenue,
      changePercentage: calculateChange(current.revenue, previous.revenue),
    },
    cost: {
      value: current.cost,
      previousValue: previous.cost,
      changePercentage: calculateChange(current.cost, previous.cost),
    },
    profit: {
      value: current.profit,
      previousValue: previous.profit,
      changePercentage: calculateChange(current.profit, previous.profit),
    },
  }
}

function groupTotalsByMonth(records: INormalizedRecord[]): Map<string, IRevenueTotals> {
  const groupedTotals = new Map<string, IRevenueTotals>()

  records.forEach((record) => {
    const key = getPeriodGroupingKey(record.date, REPORT_PERIOD)
    const totals = groupedTotals.get(key) ?? EMPTY_TOTALS

    groupedTotals.set(key, {
      revenue: totals.revenue + record.revenue,
      cost: totals.cost + record.cost,
      profit: totals.profit + record.profit,
    })
  })

  return groupedTotals
}

function formatPeriodLabel(interval: IDateInterval): string {
  return `${format(interval.from, "MM/yyyy")} - ${format(interval.to, "MM/yyyy")}`
}

export function useProductionReportV2(): IUseProductionReportV2Result {
  const currentMonthInterval = getOneYearFromProvidedDate(new Date())
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [rawRecords, setRawRecords] = useState<ProductionRecord[]>([])
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [filter, setFilter] = useState<IReportProductionFilterV2>({
    dateFrom: currentMonthInterval.from,
    dateTo: currentMonthInterval.to,
  })

  useEffect(() => {
    let isCancelled = false

    async function loadProducts(): Promise<void> {
      try {
        const response = await getProducts({
          status: ProductStatus.active,
          limit: PRODUCT_PAGE_SIZE,
        })

        if (!isCancelled) {
          setActiveProducts(response.data ?? [])
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("[useProductionReportV2.loadProducts] Failed to load active products", error)
        }
      }
    }

    void loadProducts()

    return () => {
      isCancelled = true
    }
  }, [])

  const currentInterval = useMemo(
    () => getIntervalForPeriod(filter.dateFrom, filter.dateTo, REPORT_PERIOD),
    [filter.dateFrom, filter.dateTo],
  )

  const previousInterval = useMemo(
    () => getPreviousYearInterval(currentInterval),
    [currentInterval],
  )

  const selectedProductIds = useMemo(
    () => new Set((filter.products ?? []).map((product) => product.id).filter(Boolean)),
    [filter.products],
  )

  const selectedProductsKey = useMemo(
    () => Array.from(selectedProductIds).sort().join(","),
    [selectedProductIds],
  )

  useEffect(() => {
    let isCancelled = false
    const selectedIds = selectedProductsKey ? selectedProductsKey.split(",") : []
    const serverProductFilter = selectedIds.length === 1 ? selectedIds[0] : undefined

    async function loadProductionRecords(): Promise<void> {
      try {
        setLoading(true)
        setHasError(false)

        let page = 1
        let total = 0
        let records: ProductionRecord[] = []

        do {
          const response = await getAllProductions({
            page,
            limit: PRODUCTION_PAGE_SIZE,
            sortBy: "date",
            sortOrder: "asc",
            status: ProductionStatus.completed,
            dateFrom: formatYYYYMMDD(previousInterval.from),
            dateTo: formatYYYYMMDD(currentInterval.to),
            product: serverProductFilter,
          })
          const pageRecords = (response.data as ProductionRecord[] | undefined) ?? []

          records = records.concat(pageRecords)
          total = Number(response.total ?? 0)
          page += 1
        } while ((page - 1) * PRODUCTION_PAGE_SIZE < total)

        if (!isCancelled) {
          setRawRecords(records)
        }
      } catch (error) {
        if (!isCancelled) {
          setRawRecords([])
          setHasError(true)
          console.error("[useProductionReportV2.loadProductionRecords] Failed to load production report", error)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    void loadProductionRecords()

    return () => {
      isCancelled = true
    }
  }, [currentInterval.to, previousInterval.from, selectedProductsKey])

  const normalizedRecords = useMemo<INormalizedRecord[]>(
    () =>
      rawRecords.flatMap((record) => {
        if (!record.date) return []

        const date = new Date(record.date)
        if (Number.isNaN(date.getTime())) return []

        const revenue = record.totalCost ?? 0
        const cost = record.totalExpense ?? 0

        return [{
          date,
          productId: record.product?.id,
          revenue,
          cost,
          profit: revenue - cost,
        }]
      }),
    [rawRecords],
  )

  const productFilteredRecords = useMemo(
    () => normalizedRecords.filter((record) => {
      if (selectedProductIds.size === 0) return true
      return Boolean(record.productId && selectedProductIds.has(record.productId))
    }),
    [normalizedRecords, selectedProductIds],
  )

  const currentRecords = useMemo(
    () => productFilteredRecords.filter((record) =>
      isWithinInterval(record.date, {
        start: currentInterval.from,
        end: currentInterval.to,
      }),
    ),
    [currentInterval, productFilteredRecords],
  )

  const previousRecords = useMemo(
    () => productFilteredRecords.filter((record) =>
      isWithinInterval(record.date, {
        start: previousInterval.from,
        end: previousInterval.to,
      }),
    ),
    [previousInterval, productFilteredRecords],
  )

  const summary = useMemo(
    () => createSummary(sumRecords(currentRecords), sumRecords(previousRecords)),
    [currentRecords, previousRecords],
  )

  const hasData = currentRecords.length > 0 || previousRecords.length > 0

  const comparisonData = useMemo<IProductionMonthlyComparisonRowV2[]>(() => {
    const currentTotalsByMonth = groupTotalsByMonth(currentRecords)
    const previousTotalsByMonth = groupTotalsByMonth(previousRecords)

    return eachMonthOfInterval({
      start: currentInterval.from,
      end: currentInterval.to,
    }).map((month) => {
      const currentKey = getPeriodGroupingKey(month, REPORT_PERIOD)
      const previousKey = getPeriodGroupingKey(subYears(month, 1), REPORT_PERIOD)
      const currentTotals = currentTotalsByMonth.get(currentKey) ?? EMPTY_TOTALS
      const previousTotals = previousTotalsByMonth.get(previousKey) ?? EMPTY_TOTALS

      return {
        date: currentKey,
        revenue: createMetricComparison(currentTotals.revenue, previousTotals.revenue),
        cost: createMetricComparison(currentTotals.cost, previousTotals.cost),
        profit: createMetricComparison(currentTotals.profit, previousTotals.profit),
        efficiency: {
          currentValue: calculateEfficiency(currentTotals.revenue, currentTotals.cost),
          previousValue: calculateEfficiency(previousTotals.revenue, previousTotals.cost),
        },
      }
    })
  }, [currentInterval, currentRecords, previousRecords])

  const periodLabels = useMemo<IProductionReportPeriodLabelsV2>(
    () => ({
      current: formatPeriodLabel(currentInterval),
      previous: formatPeriodLabel(previousInterval),
    }),
    [currentInterval, previousInterval],
  )

  function handleDateRangeChange(range: IDateRange | undefined): void {
    if (!range?.from || !range.to) return

    setFilter((currentFilter) => ({
      ...currentFilter,
      dateFrom: range.from ?? currentFilter.dateFrom,
      dateTo: range.to ?? currentFilter.dateTo,
    }))
  }

  return {
    loading,
    hasError,
    hasData,
    filter,
    activeProducts,
    summary,
    comparisonData,
    periodLabels,
    setFilter,
    handleDateRangeChange,
  }
}
