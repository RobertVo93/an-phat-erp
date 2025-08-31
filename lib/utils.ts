import { 
  CustomerStatus, 
  CustomerType, 
  EmployeeStatus, 
  EmployeeType, 
  OrderStatus, 
  PaymentStatus, 
  Product, 
  ProductStatus, 
  WarehouseStatus,
  ProductionStatus,
  WarehouseProduct,
  IWarehouseSummary,
  AttendanceStatus,
  AttendanceShift,
  AttendanceSubStatus,
  PayrollStatus,
} from "@/types"
import { clsx, type ClassValue } from "clsx"
import { env } from "@/constants/env"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Central currency formatting utility for VND, easily extendable for other currencies in the future
export function formatCurrencyVND(amount: number): string {
  // Always format as VND with symbol
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Optionally, update the default formatCurrency to use VND for now
export function formatCurrency(amount: number): string {
  return formatCurrencyVND(amount)
}

export function formatMonthYear(date?: Date | null): string {
  if (!date) return ""
  return date.getMonth() + 1 + "-" + date.getFullYear()
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-')
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
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

export function isTodayLocalDatetime(dateStr: Date | string): boolean {
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

// Update formatLargeCurrency to use the new utility and VND symbol
export const formatLargeCurrency = (amount: number, fixed: number = 2): string => {
  if (!amount) return "0 ₫"
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(fixed)}B ₫`
  }
  return `${amount.toLocaleString()} ₫`
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

export const getProductStatusColor = (status: string) => {
  switch (status) {
    case ProductStatus.active:
      return "bg-green-100 text-green-800"
    case ProductStatus.inactive:
      return "bg-gray-100 text-gray-800"
    case ProductStatus.lowStock:
      return "bg-yellow-100 text-yellow-800"
    case ProductStatus.outOfStock:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getCustomerStatusColor = (status: string) => {
  switch (status) {
    case CustomerStatus.active:
      return "bg-green-100 text-green-800"
    case CustomerStatus.inactive:
      return "bg-red-100 text-red-800"
    case CustomerStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getCustomerTypeColor = (type: string) => {
  switch (type) {
    case CustomerType.vip:
      return "bg-purple-100 text-purple-800"
    case CustomerType.premium:
      return "bg-blue-100 text-blue-800"
    case CustomerType.regular:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getEmployeeStatusColor = (status: string) => {
  switch (status) {
    case EmployeeStatus.active:
      return "bg-green-100 text-green-800"
    case EmployeeStatus.onLeave:
      return "bg-yellow-100 text-yellow-800"
    case EmployeeStatus.inactive:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getEmployeeTypeColor = (type: string) => {
  switch (type) {
    case EmployeeType.fullTime:
      return "bg-blue-100 text-blue-800"
    case EmployeeType.partTime:
      return "bg-purple-100 text-purple-800"
    case EmployeeType.contract:
      return "bg-orange-100 text-orange-800"
    case EmployeeType.intern:
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case OrderStatus.completed:
      return "bg-green-100 text-green-800"
    case OrderStatus.processing:
      return "bg-yellow-100 text-yellow-800"
    case OrderStatus.shipped:
      return "bg-blue-100 text-blue-800"
    case OrderStatus.delivered:
      return "bg-purple-100 text-purple-800"
    case OrderStatus.pending:
      return "bg-gray-100 text-gray-800"
    case OrderStatus.cancelled:
      return "bg-red-100 text-red-800"
    case OrderStatus.lackProduct:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PaymentStatus.paid:
      return "bg-green-100 text-green-800"
    case PaymentStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    case PaymentStatus.failed:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getWarehouseStatusColor = (status: string) => {
  switch (status) {
    case WarehouseStatus.active:
      return "bg-green-100 text-green-800"
    case WarehouseStatus.maintenance:
      return "bg-yellow-100 text-yellow-800"
    case WarehouseStatus.inactive:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStockChangeStatusColor = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_transit":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "draft":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getProductionStatusColor = (status: ProductionStatus) => {
  switch (status) {
    case ProductionStatus.completed:
      return "bg-green-100 text-green-800"
    case ProductionStatus.inProgress:
      return "bg-blue-100 text-blue-800"
    case ProductionStatus.cancelled:
      return "bg-red-100 text-red-800"
    case ProductionStatus.lackMaterial:
      return "bg-red-100 text-red-800"
    case ProductionStatus.paused:
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getAttendanceStatusColor = (status: string) => {
  switch (status) {
    case AttendanceStatus.completed: return "bg-green-100 text-green-800"
    case AttendanceStatus.draft: return "bg-gray-100 text-gray-800"
    case AttendanceStatus.waitingApproval: return "bg-yellow-100 text-yellow-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export const getAttendanceSubStatusColor = (subStatus: string) => { 
  switch (subStatus) {
    case AttendanceSubStatus.present: return "bg-green-100 text-green-800"
    case AttendanceSubStatus.late: return "bg-yellow-100 text-yellow-800"
    case AttendanceSubStatus.absent: return "bg-red-100 text-red-800"
    case AttendanceSubStatus.leave: return "bg-blue-100 text-blue-800"
    case AttendanceSubStatus.overtime: return "bg-purple-100 text-purple-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export const getAttendanceShiftColor = (shift: string) => {
  switch (shift) {
    case AttendanceShift.morning: return "bg-orange-100 text-orange-800"
    case AttendanceShift.afternoon: return "bg-blue-100 text-blue-800"
    case AttendanceShift.evening: return "bg-indigo-100 text-indigo-800"
    case AttendanceShift.all: return "bg-gray-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export const getPayrollStatusColor = (status: string) => {
  switch (status) {
    case PayrollStatus.draft:
      return "bg-orange-100 text-orange-800"
    case PayrollStatus.processing:
      return "bg-blue-100 text-blue-800"
    case PayrollStatus.processed:
      return "bg-green-100 text-green-800"
    case PayrollStatus.pending:
      return "bg-yellow-100 text-yellow-800"
    case PayrollStatus.failed:
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
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