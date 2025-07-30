import { Product } from "@/types"
import { IWarehouseSummary, WarehouseProduct } from "@/types/warehouseProduct"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-')
}

export function formatYYYYMMDD(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // getMonth: 0-11
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatLocalDatetime(date: Date | string) {
  const dateData = new Date(date);
  const offset = dateData.getTimezoneOffset();
  const local = new Date(dateData.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

export function extractHourMinute(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isTodayLocalDatetime(dateStr: string): boolean {
  const inputDate = new Date(dateStr);

  const now = new Date();
  return (
    inputDate.getFullYear() === now.getFullYear() &&
    inputDate.getMonth() === now.getMonth() &&
    inputDate.getDate() === now.getDate()
  );
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

export const formatLargeCurrency = (amount: number, fixed: number): string => {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(fixed)}M đ`
  }
  return `${amount.toLocaleString()} đ`
}

export function groupWarehouseProductsByProduct(whProducts: WarehouseProduct[]): IWarehouseSummary[] {
  const result: Record<string, { product: Product; totalQuantity: number }> = {}

  for (const item of whProducts) {
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