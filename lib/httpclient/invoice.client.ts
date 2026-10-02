import { Invoice, InvoiceFilters } from "@/types";
import { apiHref, createApiUrl, apiFetch } from "@/lib/httpclient/base";

export async function getAllInvoices(filters: InvoiceFilters) {
  const url = createApiUrl("/api/invoice");
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value))
  })
  const res = await apiFetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch Invoices");
  return res.json();
}

export async function addInvoice(data: Partial<Invoice>) {
  const res = await apiFetch(apiHref("/api/invoice"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create Invoice");
  return res.json();
}

export async function updateInvoice(id: string, data: Partial<Invoice>) {
  const res = await apiFetch(apiHref(`/api/invoice/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Invoice");
  return res.json();
}

export async function deleteInvoice(id: string) {
  const res = await apiFetch(apiHref(`/api/invoice/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete Invoice");
  return res;
} 