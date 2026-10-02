import { PayrollFilters } from "@/types/payroll"
import { apiHref, createApiUrl, apiFetch } from "@/lib/httpclient/base"

export async function getAllPayrollsClient(params: PayrollFilters = {}) {
  const url = createApiUrl("/api/payroll")
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value))
  })
  const res = await apiFetch(url.toString(), { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch payroll records")
  return res.json() // should return { data, total }
}

export async function syncPayrollClient(payPeriod: Date) {
  const url = createApiUrl("/api/payroll/sync")
  url.searchParams.append("payPeriod", payPeriod.toISOString())
  const res = await apiFetch(url.toString(), { credentials: "include" })
  if (!res.ok) throw new Error("Failed to sync payroll records")
  return res.json()
}

export async function approvePayrollClient(id: string) {
  const res = await apiFetch(apiHref(`/api/payroll/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to approve payroll");
  return res.json();
}

export async function deletePayrollClient(id: string) {
  const res = await apiFetch(apiHref(`/api/payroll/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete payroll");
  return res;
}