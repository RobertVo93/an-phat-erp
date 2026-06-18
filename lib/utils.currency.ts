import { Language } from "@/types"

const MILLION = 1_000_000
const BILLION = 1_000_000_000

export const formatNumberWithCommas = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") return ""
  const [int, dec] = value.toString().split(".")
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dec ? `.${dec}` : "")
}

const formatCompactValue = (value: number): string => {
  const raw = value.toFixed(3).replace(/\.?0+$/, "")
  return formatNumberWithCommas(raw).replace(".", ",")
}

// Keep compact rule strict to match UX:
// - compact only for numbers >= 1,000,000
// - and only when value is divisible by 1,000
// So 1,101,000 => 1,101M/Tr but 1,101,500 stays full number.
export function formatSystemNumber(value: number | null | undefined, locale: Language = "vi"): string {
    if (value === null || value === undefined) return ""
  const abs = Math.abs(value)

  if (abs >= BILLION && abs % MILLION === 0) {
    const suffix = locale === "vi" ? "Tỷ" : "B"
    const billionValue = value / BILLION
    return `${formatCompactValue(billionValue)}${suffix}`
  }

  if (abs >= MILLION && abs % 1_000 === 0) {
    const suffix = locale === "vi" ? "Tr" : "M"
    const millionValue = value / MILLION

    return `${formatCompactValue(millionValue)}${suffix}`
  }

  return formatNumberWithCommas(value)
}

export function parseSystemNumberInput(raw: string): number {
  const normalized = raw.trim()
  if (!normalized) return 0

  const isBillionSuffix = /(tỷ|ty|b)$/i.test(normalized)
  if (isBillionSuffix) {
    const numberPart = normalized
      .replace(/(tỷ|ty|b)$/i, "")
      .trim()
      .replace(/\./g, "")
      .replace(",", ".")
    const parsed = Number.parseFloat(numberPart)
    return Number.isNaN(parsed) ? 0 : parsed * BILLION
  }

  const isMillionSuffix = /(tr|m)$/i.test(normalized)
  if (isMillionSuffix) {
    const numberPart = normalized
      .replace(/(tr|m)$/i, "")
      .trim()
      .replace(/\./g, "")
      .replace(",", ".")
    const parsed = Number.parseFloat(numberPart)
    return Number.isNaN(parsed) ? 0 : parsed * MILLION
  }

  return Number.parseFloat(normalized.replace(/,/g, "")) || 0
}

// Backward-compatible helpers currently used in app
export function formatCurrencyVND(amount: number): string {
  return `${formatNumberWithCommas(amount)} ₫`
}

export function formatCurrency(amount: number): string {
  return formatCurrencyVND(amount)
}

export const formatLargeCurrency = (amount: number, locale: Language = "vi"): string => {
  return `${formatSystemNumber(amount, locale)} ₫`
}
