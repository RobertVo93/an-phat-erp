"use client"

import { getProducts } from "@/lib/httpclient"
import { getAllProductions } from "@/lib/httpclient/production.client"
import { Product, ProductionStatus, ProductStatus, ReportPeriod } from "@/types"
import { ProductionRecord } from "@/types/production"
import { IReportRow, ReportProductionFilter } from "@/types/report-production.interface"
import { useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { getCurrentWeekRange } from "@/lib/period_utils"
import { useLanguage } from "@/contexts/language-context"
import { enUS, vi, Locale } from "date-fns/locale"

export function useReportProduction() {
  const { language } = useLanguage()
  const [locale, setLocale] = useState<Locale>(enUS)
  const [loading, setLoading] = useState<boolean>(false)
  const [rawRecords, setRawRecords] = useState<ProductionRecord[]>([])
  const [reportRows, setReportRows] = useState<IReportRow[]>([])
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filter, setFilter] = useState<ReportProductionFilter>({
    dateFrom: new Date(),
    dateTo: new Date()
  })
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>(ReportPeriod.day)
  const [activeProducts, setActiveProducts] = useState<Product[]>([])
  const [comparingProduct, setComparingProduct] = useState<Product>()

  function getGroupingKey(date: Date, period: ReportPeriod): string {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = String(date.getFullYear())

    switch (period) {
      case ReportPeriod.day:
        return `${day}/${month}/${year}`
      case ReportPeriod.month:
        return `${month}-${year}`
      case ReportPeriod.year:
        return year
    }
  }

  function sortByDateKey(a: string, b: string, period: ReportPeriod): number {
    const parseKey = (key: string): Date => {
      switch (period) {
        case ReportPeriod.day:
          const [day, month, year] = key.split("/").map(Number)
          return new Date(year, month - 1, day)
        case ReportPeriod.month:
          const [m, y] = key.split("-").map(Number)
          return new Date(y, m - 1)
        case ReportPeriod.year:
          return new Date(Number(key), 0)
      }
    }
    return parseKey(a).getTime() - parseKey(b).getTime()
  }

  function parseProductionRecordsToReport(
    data: ProductionRecord[],
    filterProducts: Product[],
    reportPeriod: ReportPeriod
  ): IReportRow[] {
    const grouped: Record<string, IReportRow> = {};
    const filterProductNames = filterProducts?.map(product => product.name ?? "").filter(name => name) || [];

    if (reportPeriod === ReportPeriod.year) {
      const startYear = filter.dateFrom.getFullYear();
      const endYear = filter.dateTo.getFullYear();
      for (let year = startYear; year <= endYear; year++) {
        const key = String(year);
        if (!grouped[key]) {
          grouped[key] = {
            date: key,
            cost: 0,
            revenue: 0,
            profit: 0,
            efficiency: 0,
            productEfficiencies: {},
          };
        }
      }
    }

    for (const record of data) {
      if (!record.date || !record.product || !record.quantity) continue;

      const productName = record.product.name ?? "";
      if (filterProductNames.length > 0 && !filterProductNames.includes(productName)) continue;

      const date = new Date(record.date);
      const key = getGroupingKey(date, reportPeriod);

      const unitPrice = record.product.price ?? 0;
      const totalRevenue = unitPrice * record.quantity;
      const totalCost = record.totalCost ?? 0;
      const profit = totalRevenue - totalCost;

      if (!grouped[key]) {
        grouped[key] = {
          date: key,
          cost: 0,
          revenue: 0,
          profit: 0,
          efficiency: 0,
          productEfficiencies: {},
        };
      }

      grouped[key][productName] = ((grouped[key][productName] as number) ?? 0) + record.quantity;
      grouped[key].cost += totalCost;
      grouped[key].revenue += totalRevenue;
      grouped[key].profit += profit;

      grouped[key].productEfficiencies[productName] =
        totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 100) : 0;
    }

    for (const row of Object.values(grouped)) {
      const filteredEfficiencies = Object.keys(row.productEfficiencies)
        .filter(product => filterProductNames.length === 0 || filterProductNames.includes(product))
        .map(product => row.productEfficiencies[product]);
      row.efficiency =
        filteredEfficiencies.length > 0
          ? Math.round(filteredEfficiencies.reduce((sum, eff) => sum + eff, 0) / filteredEfficiencies.length)
          : 0;
    }

    return Object.values(grouped).sort((a, b) => sortByDateKey(a.date, b.date, reportPeriod));
  }

  const onInit = async () => {
    try {
      setLoading(true)
      const res = await getAllProductions()
      const resData = res.data as ProductionRecord[]
      setRawRecords(resData)

      const reportRows = parseProductionRecordsToReport(resData, filter.products!, reportPeriod)
      setReportRows(reportRows)

      const pro = await getProducts()
      const activeProductList = (pro.data as Product[]).filter((pro) => pro.status === ProductStatus.active)
      setActiveProducts(activeProductList)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedProductions = useMemo(() => {
    const filtered = reportRows.filter((row) => {
      if (!row.date) return false;

      let rowDate: Date;

      try {
        switch (reportPeriod) {
          case ReportPeriod.day:
            const [dayStr, monthStr, yearStr] = row.date.split("/").map(Number);
            rowDate = new Date(yearStr, monthStr - 1, dayStr);
            return isWithinInterval(rowDate, { start: filter.dateFrom, end: filter.dateTo });
          case ReportPeriod.month:
            const [monthStrM, yearStrM] = row.date.split("-").map(Number);
            rowDate = new Date(yearStrM, monthStrM - 1, 1);
            return isWithinInterval(rowDate, { start: startOfMonth(filter.dateFrom), end: endOfMonth(filter.dateTo) });
          case ReportPeriod.year:
            rowDate = new Date(Number(row.date), 0, 1);
            return isWithinInterval(rowDate, { start: startOfYear(filter.dateFrom), end: endOfYear(filter.dateTo) });
          default:
            return false;
        }
      } catch {
        console.error(`Error parsing date: ${row.date} for reportPeriod: ${reportPeriod}`);
        return false;
      }
    });

    filtered.sort((a, b) => {
      let aDate: Date, bDate: Date;

      try {
        switch (reportPeriod) {
          case ReportPeriod.day:
            const [ad, am, ay] = a.date.split("/").map(Number);
            const [bd, bm, by] = b.date.split("/").map(Number);
            aDate = new Date(ay, am - 1, ad);
            bDate = new Date(by, bm - 1, bd);
            break;
          case ReportPeriod.month:
            const [amM, ayM] = a.date.split("-").map(Number);
            const [bmM, byM] = b.date.split("-").map(Number);
            aDate = new Date(ayM, amM - 1, 1);
            bDate = new Date(byM, bmM - 1, 1);
            break;
          case ReportPeriod.year:
            aDate = new Date(Number(a.date), 0, 1);
            bDate = new Date(Number(b.date), 0, 1);
            break;
          default:
            return 0;
        }

        return aDate.getTime() - bDate.getTime();
      } catch {
        console.error(`Error sorting dates: ${a.date}, ${b.date} for reportPeriod: ${reportPeriod}`);
        return 0;
      }
    });

    return filtered;
  }, [reportRows, filter, reportPeriod]);

  function getColorByIndex(index: number): string {
    const colors = [
      "#FF6B6B",
      "#4D96FF",
      "#FFC300",
      "#8E44AD",
      "#FF8C42"
    ]

    return colors[index % colors.length]
  }

  //filter by daterange
  const filterReportRows = (
    data: IReportRow[],
    dateRange: DateRange,
    reportPeriod: ReportPeriod
  ): IReportRow[] => {
    if (!dateRange.from || !dateRange.to) return data;

    return data.filter((row) => {
      let rowDate: Date;

      try {
        if (reportPeriod === ReportPeriod.day) {
          const [d, m, y] = row.date.split("/").map(Number);
          rowDate = new Date(y, m - 1, d);
          return isWithinInterval(rowDate, { start: dateRange.from!, end: dateRange.to! });
        } else if (reportPeriod === ReportPeriod.month) {
          const [m, y] = row.date.split("-").map(Number);
          rowDate = new Date(y, m - 1, 1);
          return isWithinInterval(rowDate, { start: startOfMonth(dateRange.from!), end: endOfMonth(dateRange.to!) });
        } else if (reportPeriod === ReportPeriod.year) {
          rowDate = new Date(Number(row.date), 0, 1);
          return isWithinInterval(rowDate, { start: startOfYear(dateRange.from!), end: endOfYear(dateRange.to!) });
        } else {
          return false;
        }
      } catch {
        console.error(`Error parsing row.date: ${row.date} for reportPeriod: ${reportPeriod}`);
        return false;
      }
    });
  };

  // calculate comparison
  const monthlyComparisonData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1

    if (!comparingProduct || !comparingProduct.name) return []

    const productName = comparingProduct.name

    const monthYearTotals: Record<number, Record<number, number>> = {}

    rawRecords.forEach((record) => {
      if (!record.date || record.status !== ProductionStatus.completed || !record.product || !record.quantity) return

      if (record.product.name !== productName) return

      const date = new Date(record.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (year !== currentYear && year !== lastYear) return

      if (!monthYearTotals[month]) monthYearTotals[month] = {}
      if (!monthYearTotals[month][year]) monthYearTotals[month][year] = 0

      monthYearTotals[month][year] += record.quantity
    })

    const result: {
      month: string
      product: string
      thisYear: number
      lastYear: number
      growth: number
    }[] = []

    for (let m = 1; m <= 12; m++) {
      const thisYearVal = monthYearTotals[m]?.[currentYear] || 0
      const lastYearVal = monthYearTotals[m]?.[lastYear] || 0
      const growth = (lastYearVal && thisYearVal) > 0 ? +(((thisYearVal - lastYearVal) / lastYearVal) * 100).toFixed(1) : 0

      result.push({
        month: `${m}`,
        product: productName,
        thisYear: thisYearVal,
        lastYear: lastYearVal,
        growth,
      })
    }

    return result
  }, [rawRecords, comparingProduct])

  const productPerformanceData = useMemo(() => {
    const totals: Record<
      string,
      {
        quantity: number;
        revenue: number;
        cost: number;
      }
    > = {};

    // Filter records by date range
    const filteredRecords = rawRecords.filter((record) => {
      if (!record.date) return false;
      const recordDate = new Date(record.date);
      return isWithinInterval(recordDate, { start: filter.dateFrom, end: filter.dateTo });
    });

    filteredRecords.forEach((record) => {
      if (
        !record.date ||
        record.status !== ProductionStatus.completed ||
        !record.product ||
        !record.product.name ||
        !record.quantity
      )
        return;

      const productName = record.product.name;
      const unitPrice = record.product.price ?? 0;
      const quantity = record.quantity;
      const totalCost = record.totalCost ?? 0;
      const totalRevenue = unitPrice * quantity;

      if (!totals[productName]) {
        totals[productName] = { quantity: 0, revenue: 0, cost: 0 };
      }

      totals[productName].quantity += quantity;
      totals[productName].revenue += totalRevenue;
      totals[productName].cost += totalCost;
    });

    const result = Object.entries(totals).map(([product, data]) => {
      const profit = data.revenue - data.cost;
      const margin = data.revenue > 0 ? +((profit / data.revenue) * 100).toFixed(1) : 0;

      return {
        product,
        quantity: data.quantity,
        revenue: data.revenue,
        cost: data.cost,
        profit,
        margin,
      };
    });

    return result;
  }, [rawRecords, filter.dateFrom, filter.dateTo]);

  // for summary card
  const summary = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
    const lastMonth = lastMonthDate.getMonth()
    const lastMonthYear = lastMonthDate.getFullYear()

    let revenueThisMonth = 0
    let revenueLastMonth = 0
    let costThisMonth = 0
    let costLastMonth = 0

    rawRecords.forEach((record) => {
      if (
        !record.date ||
        record.status !== ProductionStatus.completed ||
        !record.product ||
        !record.quantity
      )
        return

      const date = new Date(record.date)
      const unitPrice = record.product.price ?? 0
      const totalRevenue = unitPrice * record.quantity
      const totalCost = record.totalCost ?? 0

      if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
        revenueThisMonth += totalRevenue
        costThisMonth += totalCost
      } else if (date.getFullYear() === lastMonthYear && date.getMonth() === lastMonth) {
        revenueLastMonth += totalRevenue
        costLastMonth += totalCost
      }
    })

    const profitThisMonth = revenueThisMonth - costThisMonth
    const profitLastMonth = revenueLastMonth - costLastMonth

    const calcGrowth = (thisVal: number, lastVal: number): number | null => {
      if (thisVal === 0 || lastVal === 0) return null
      return +(((thisVal - lastVal) / lastVal) * 100).toFixed(1)
    }

    return {
      revenue: {
        thisMonth: revenueThisMonth,
        lastMonth: revenueLastMonth,
        growth: calcGrowth(revenueThisMonth, revenueLastMonth),
      },
      cost: {
        thisMonth: costThisMonth,
        lastMonth: costLastMonth,
        growth: calcGrowth(costThisMonth, costLastMonth),
      },
      profit: {
        thisMonth: profitThisMonth,
        lastMonth: profitLastMonth,
        growth: calcGrowth(profitThisMonth, profitLastMonth),
      },
    }
  }, [rawRecords])

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
    const completed = rawRecords.filter((r) => r.status === ProductionStatus.completed)
    const rows = parseProductionRecordsToReport(completed, filter.products!, reportPeriod)
    setReportRows(rows)
  }, [rawRecords, filter, reportPeriod])

  useEffect(() => {
    language === "vi" ? setLocale(vi) : setLocale(enUS)
  }, [language])

  return {
    loading,
    productionData: filterReportRows(filteredAndSortedProductions, { from: filter.dateFrom, to: filter.dateTo }, reportPeriod),
    showFilterModal,
    filter,
    activeProducts,
    reportPeriod,
    monthlyComparisonData,
    comparingProduct,
    rawRecords,
    productPerformanceData,
    summary,
    locale,

    setComparingProduct,
    setFilter,
    setShowFilterModal,
    setReportPeriod,
    getColorByIndex,
    handleDateRangeChange,
  }
}
