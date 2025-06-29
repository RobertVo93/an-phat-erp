import { Invoice } from "@/types";

export async function getAllInvoices() {
  const url = new URL("/api/invoice", window.location.origin);
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch Invoices");
  return res.json();
}

export async function addInvoice(data: Partial<Invoice>) {
  const res = await fetch("/api/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create Invoice");
  return res.json();
}

export async function updateInvoice(id: string, data: Partial<Invoice>) {
  const res = await fetch(`/api/invoice/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Invoice");
  return res.json();
}

export async function deleteInvoice(id: string) {
  const res = await fetch(`/api/invoice/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete Invoice");
  return res;
} 