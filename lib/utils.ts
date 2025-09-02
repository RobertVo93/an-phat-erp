import {
  Product,
  WarehouseProduct,
  IWarehouseSummary,
} from "@/types"
import { clsx, type ClassValue } from "clsx"
import { env } from "@/constants/env"
import { twMerge } from "tailwind-merge"
import { formatMonthYear } from "@/lib/utils.date"
export * from "@/lib/utils.currency"
export * from "@/lib/utils.date"
export * from "@/lib/utils.style"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export function groupWarehouseProductsByProduct(whProducts: WarehouseProduct[]): IWarehouseSummary[] {
  const result: Record<string, { product: Product; totalQuantity: number }> = {}

  for (const item of (whProducts || [])) {
    const productId = item.product?.id
    if (!productId) continue

    if (!result[productId]) {
      result[productId] = {
        product: item.product!,
        totalQuantity: item.quantity ?? 0,
      }
    } else {
      result[productId].totalQuantity += item.quantity ?? 0
    }
  }

  return Object.values(result)
}

export const getCustomerInitialCharacter = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export const formatNumberWithCommas = (value: string | number): string => {
  if (value === null || value === undefined) return "";
  const [int, dec] = value.toString().split(".");
  return (
    int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (dec ? "." + dec : "")
  );
}

export const parseNumberInput = (value: string): number => {
  return parseFloat((value || "0").replace(/,/g, ""));
}

export const hasValidArray = (arr: any) => {
  return Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every(item => item && typeof item.id === "string" && item.id.trim() !== "");
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Calculate the difference in work hours between two times (fromTime to toTime)
 * @param fromTime - The start time
 * @param toTime - The end time
 * @returns The difference in work hours
 */
export const calculateDiffWorkHours = (fromTime: Date | string, toTime: Date | string): number => {
  const fromTimeDate = new Date(fromTime)
  const toTimeDate = new Date(toTime)
  if (!fromTimeDate || !toTimeDate) return 0;

  if (isNaN(fromTimeDate.getTime()) || isNaN(toTimeDate.getTime()) || toTimeDate <= fromTimeDate) {
    return 0;
  }
  const diffMinutes = (toTimeDate.getTime() - fromTimeDate.getTime()) / (1000 * 60);
  const roundedMinutes = Math.round(diffMinutes / 15) * 15;
  return Math.round((roundedMinutes / 60) * 100) / 100;
}

/**
 * Get list of pay periods from system start period to today
 * @returns List of pay periods like [..., "03-2025", "02-2025", "01-2025"]
 */
export const getSystemPayPeriod = (): string[] => {
  const startPeriod = new Date(env.NEXT_PUBLIC_SYSTEM_PAY_PERIOD_START)
  const today = new Date();
  today.setDate(1);
  const periods = [];
  for (let i = today; i > startPeriod; i.setMonth(i.getMonth() - 1)) {
    periods.push(formatMonthYear(i));
  }
  return periods;
}