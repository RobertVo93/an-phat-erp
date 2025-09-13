import { Customer, CustomerFilters } from "@/types/customer";
import { withApiBase } from "@/lib/base-path";

export async function getCustomers(params: CustomerFilters = {}) {
  const url = new URL(withApiBase("/api/customers"), window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
}

export async function createCustomer(data: Partial<Customer>) {
  const res = await fetch(withApiBase("/api/customers"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  const res = await fetch(withApiBase(`/api/customers/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
}

export async function deleteCustomer(id: string) {
  const res = await fetch(withApiBase(`/api/customers/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete customer");
  return res;
} 