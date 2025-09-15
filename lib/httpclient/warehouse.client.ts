import { ProductInWarehouseFilters, Warehouse, WarehouseFilters } from "@/types";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";

export async function getWarehouses(params: WarehouseFilters = {}) {
  const url = createApiUrl("/api/warehouse");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch warehouses");
  return res.json();
}

export async function getWarehouseById(id: string) {
  const res = await fetch(apiHref(`/api/warehouse/${id}`));
  return res.json();
}

export async function addWarehouse(data: Partial<Warehouse>) {
  const res = await fetch(apiHref("/api/warehouse"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add warehouse");
  return res.json();
}

export async function updateWarehouse(id: string, data: Partial<Warehouse>) {
  const res = await fetch(apiHref(`/api/warehouse/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update warehouse");
  return res.json();
}

export async function deleteWarehouse(id: string) {
  const res = await fetch(apiHref(`/api/warehouse/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete warehouse");
  return res;
}

export async function transferWarehouse(data: {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  productId: string;
  quantity: number;
}) {
  const res = await fetch(apiHref(`/api/warehouse/transfer`), {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to transfer product");

  return res.json();
}

////Warehouse Product////
export async function getProductInWarehouseByFiltersClient(params: ProductInWarehouseFilters = {}) {
  const url = createApiUrl("/api/warehouse-product");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch product in warehouse");
  return res.json();
}