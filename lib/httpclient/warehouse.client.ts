import { Warehouse, WarehouseFilters } from "@/types";

export async function getWarehouses(params: WarehouseFilters = {}) {
  const url = new URL("/api/warehouse", window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch warehouses");
  return res.json();
}

export async function addWarehouse(data: Partial<Warehouse>) {
  const res = await fetch("/api/warehouse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add warehouse");
  return res.json();
}

export async function updateWarehouse(id: string, data: Partial<Warehouse>) {
  const res = await fetch(`/api/warehouse/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update warehouse");
  return res.json();
}

export async function deleteWarehouse(id: string) {
  const res = await fetch(`/api/warehouse/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete warehouse");
  return res;
} 