"use client"

import { getProducts } from "@/lib/httpclient"
import { getAllProductions } from "@/lib/httpclient/production.client"
import { Product, ProductionStatus, ProductStatus, ReportViewBy, ReportViewType } from "@/types"
import { ProductionRecord } from "@/types/production"
import { ProductionFormat, ReportProductionFilter } from "@/types/report-production"
import { useEffect, useMemo, useState } from "react"

export function useReportProduction() {
  const [loading, setLoading] = useState<boolean>(false)
  const [rawRecords, setRawRecords] = useState<ProductionRecord[]>([])
  const [productions, setProductions] = useState<ProductionFormat[]>([])
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filter, setFilter] = useState<ReportProductionFilter>({})
  const [viewType, setViewType] = useState<ReportViewType>(ReportViewType.table)
  const [viewBy, setViewBy] = useState<ReportViewBy>(ReportViewBy.daily)
  const [activeProducts, setActiveProducts] = useState<Product[]>([])

  function parseProductionRecordHandler(record: ProductionRecord): ProductionFormat {
    const productId = record.product?.id ?? ""
    const name = record.product?.name ?? ""
    const quantity = record.quantity ?? 0
    const unitPrice = record.product?.price ?? 0
    const totalPrice = quantity * unitPrice
    const totalCost = record.totalCost ?? 0
    const profit = totalPrice - totalCost
    const time = record.date ?? ''

    return {
      productId,
      name,
      quantity,
      totalPrice,
      totalCost,
      profit,
      time,
    }
  }

  const onInit = async () => {
    try {
      setLoading(true)
      const res = await getAllProductions()
      const resData = res.data as ProductionRecord[]

      setRawRecords(resData)

      const pro = await getProducts()
      const activeProductList = (pro.data as Product[]).filter((pro) => pro.status === ProductStatus.active)
      setActiveProducts(activeProductList)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function compareMonthYear(a: string, b: string): number {
    const [yearA, monthA] = a.split("/").map(Number)
    const [yearB, monthB] = b.split("/").map(Number)
    return (yearA - yearB) * 12 + (monthA - monthB)
  }

  function compareDate(a: string, b: string): number {
    return new Date(a).getTime() - new Date(b).getTime()
  }

  const filteredAndSortedProductions = useMemo(() => {
    const filtered = productions.filter((production) => {
      const matchesProduct = !filter.products?.length
        ? true
        : filter.products.some((p) => p.id === production.productId)

      const matchesDateFrom = (() => {
        if (!filter.dateFrom) return true

        if (viewBy === ReportViewBy.daily) {
          return compareDate(production.time, filter.dateFrom) >= 0
        }

        if (viewBy === ReportViewBy.monthly) {
          const prodMonth = production.time.slice(0, 7).replace("-", "/") // yyyy/mm
          const fromMonth = filter.dateFrom.replace("-", "/")            // yyyy/mm
          return compareMonthYear(prodMonth, fromMonth) >= 0
        }

        if (viewBy === ReportViewBy.yearly) {
          return parseInt(production.time.slice(0, 4)) >= Number(filter.dateFrom)
        }

        return true
      })()

      const matchesDateTo = (() => {
        if (!filter.dateTo) return true

        if (viewBy === ReportViewBy.daily) {
          return compareDate(production.time, filter.dateTo) <= 0
        }

        if (viewBy === ReportViewBy.monthly) {
          const prodMonth = production.time.slice(0, 7).replace("-", "/")
          const toMonth = filter.dateTo.replace("-", "/")
          return compareMonthYear(prodMonth, toMonth) <= 0
        }

        if (viewBy === ReportViewBy.yearly) {
          return parseInt(production.time.slice(0, 4)) <= Number(filter.dateTo)
        }

        return true
      })()

      return matchesProduct && matchesDateFrom && matchesDateTo
    })

    filtered.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return filtered
  }, [productions, filter, viewBy])


  useEffect(() => {
    onInit()
  }, [])

  useEffect(() => {
    const formattedRecords: ProductionFormat[] = rawRecords
      .filter((rd) => rd.status === ProductionStatus.completed)
      .map(parseProductionRecordHandler)

    setProductions(formattedRecords)
  }, [filter, rawRecords, viewBy])

  return {
    loading,
    data: filteredAndSortedProductions,
    showFilterModal,
    filter,
    viewType,
    viewBy,
    activeProducts,

    setFilter,
    setShowFilterModal,
    setViewType,
    setViewBy,
  }
}
