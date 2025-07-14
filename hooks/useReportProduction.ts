"use client"

import { getProducts } from "@/lib/httpclient"
import { getAllProductions } from "@/lib/httpclient/production.client"
import { Product, ProductionStatus, ProductStatus, ReportViewBy, ReportViewType } from "@/types"
import { ProductionRecord } from "@/types/production"
import { ProductionFormat, ReportProductionFilter } from "@/types/report-production"
import { useEffect, useMemo, useState } from "react"

const mockdata: ProductionFormat[] = [
  {
    productId: "1",
    name: "bánh mì",
    profit: 100,
    quantity: 100,
    totalCost: 15000,
    totalPrice: 20000,
    time: "2025-07-09"
  },
  {
    productId: "2",
    name: "bánh tráng",
    profit: 200,
    quantity: 100,
    totalCost: 15000,
    totalPrice: 20000,
    time: "2025-06-09"
  },
  {
    productId: "3",
    name: "cơm chay",
    profit: 100,
    quantity: 100,
    totalCost: 15000,
    totalPrice: 20000,
    time: "2025-05-09"
  },
  {
    productId: "4",
    name: "phở",
    profit: 300,
    quantity: 100,
    totalCost: 15000,
    totalPrice: 20000,
    time: "2025-04-09"
  },
]

export function useReportProduction() {
  const [loading, setLoading] = useState<boolean>(false)
  const [rawRecords, setRawRecords] = useState<ProductionRecord[]>([])
  const [productions, setProductions] = useState<ProductionFormat[]>([])
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filter, setFilter] = useState<ReportProductionFilter>({ })
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
    let time = ""

    switch (viewBy) {
      case (ReportViewBy.yearly): {
        if (record.date) {
          const date = new Date(record.date)
          time = `${date.getFullYear()}`
        }
        break
      }
      case (ReportViewBy.daily): {
        time = record.date ? new Date(record.date).toISOString().split("T")[0] : ""
        break
      }
      case (ReportViewBy.monthly): {
        if (record.date) {
          const date = new Date(record.date)
          const month = String(date.getMonth() + 1).padStart(2, "0")
          const year = date.getFullYear()
          time = `${year}-${month}`
        }
        break
      }
      default: break
    }

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
    const [monthA, yearA] = a.split("-").map(Number)
    const [monthB, yearB] = b.split("-").map(Number)
    const dateA = new Date(yearA, monthA - 1)
    const dateB = new Date(yearB, monthB - 1)
    return dateA.getTime() - dateB.getTime()
  }

  const filteredAndSortedProductions = useMemo(() => {
    const filtered = productions.filter((production) => {
      const matchesProduct = !filter.products?.length
        ? true
        : filter.products.some((p) => p.id === production.productId)

      const matchesDateFrom = (() => {
        if (!filter.dateFrom) return true
        if (viewBy === ReportViewBy.daily) return production.time >= filter.dateFrom
        if (viewBy === ReportViewBy.monthly) return compareMonthYear(production.time, filter.dateFrom) >= 0
        if (viewBy === ReportViewBy.yearly) return parseInt(production.time) >= parseInt(filter.dateFrom)
        return true
      })()

      const matchesDateTo = (() => {
        if (!filter.dateTo) return true
        if (viewBy === ReportViewBy.daily) return production.time <= filter.dateTo
        if (viewBy === ReportViewBy.monthly) return compareMonthYear(production.time, filter.dateTo) <= 0
        if (viewBy === ReportViewBy.yearly) return parseInt(production.time) <= parseInt(filter.dateTo)
        return true
      })()

      return (
        matchesProduct &&
        matchesDateFrom && matchesDateTo
      )
    })

    // Sort
    filtered.sort((a, b) => b.name.localeCompare(a.name));

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
