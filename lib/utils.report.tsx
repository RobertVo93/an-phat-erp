import { ReportPeriod } from "@/types"
import {
  addDays,
  addMonths,
  addYears,
  endOfDay,
  endOfMonth,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns"

type DeltaLabelProps = {
  x?: number | string
  y?: number | string
  width?: number | string
  value?: number | string | null
}

export const renderDeltaPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "--"
  return `${value > 0 ? "+" : ""}${value}%`
}

export const renderDeltaLabel = (props: DeltaLabelProps) => {
  const { x = 0, y = 0, width = 0, value } = props
  if (value === null || value === undefined) return null

  const numericValue = typeof value === "string" ? parseFloat(value) : value
  if (numericValue === null || numericValue === undefined || Number.isNaN(numericValue)) return null

  const xPos = typeof x === "number" ? x : parseFloat(x) || 0
  const yPos = typeof y === "number" ? y : parseFloat(y) || 0
  const widthValue = typeof width === "number" ? width : parseFloat(width) || 0

  const fill = numericValue > 0 ? "#16a34a" : "#dc2626"
  return (
    <text x={xPos + widthValue / 2} y={yPos - 4} fill={fill} fontSize={11} textAnchor="middle">
      {renderDeltaPercent(numericValue)}
    </text>
  )
}

export const getPeriodGroupingKey = (date: Date, period: ReportPeriod): string => {
  if (period === ReportPeriod.day) return format(date, "dd/MM/yyyy")
  if (period === ReportPeriod.month) return format(date, "MM-yyyy")
  return format(date, "yyyy")
}

export const parsePeriodGroupingKey = (value: string, period: ReportPeriod): Date => {
  if (period === ReportPeriod.day) {
    const [day, month, year] = value.split("/").map(Number)
    return new Date(year, month - 1, day)
  }
  if (period === ReportPeriod.month) {
    const [month, year] = value.split("-").map(Number)
    return new Date(year, month - 1, 1)
  }
  return new Date(Number(value), 0, 1)
}

export const shiftDateByPeriod = (date: Date, period: ReportPeriod, amount: number): Date => {
  if (period === ReportPeriod.day) return addDays(date, amount)
  if (period === ReportPeriod.month) return addMonths(date, amount)
  return addYears(date, amount)
}

export const calcGrowth = (current: number, baseline: number): number | null => {
  if (baseline === 0) return null
  return +(((current - baseline) / baseline) * 100).toFixed(1)
}

export const normalizeRange = (dateFrom: Date, dateTo: Date): { from: Date; to: Date } => {
  const from = startOfDay(dateFrom)
  const to = endOfDay(dateTo)
  return from <= to ? { from, to } : { from: startOfDay(dateTo), to: endOfDay(dateFrom) }
}

export const getIntervalForPeriod = (dateFrom: Date, dateTo: Date, period: ReportPeriod): { from: Date; to: Date } => {
  const normalized = normalizeRange(dateFrom, dateTo)

  if (period === ReportPeriod.month) {
    return {
      from: startOfMonth(normalized.from),
      to: endOfMonth(normalized.to),
    }
  }

  if (period === ReportPeriod.year) {
    return {
      from: startOfYear(normalized.from),
      to: endOfYear(normalized.to),
    }
  }

  return normalized
}