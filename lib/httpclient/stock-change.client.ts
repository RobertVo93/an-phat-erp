import { StockChange, StockChangeFilters } from "@/types";
import { withApiBase } from "@/lib/base-path";

export async function getAllStockChanges(params: StockChangeFilters = {}) {
  const url = new URL(withApiBase("/api/stock-change"), window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch stock-changes");
  return res.json();
}

export async function addStockChange(data: Partial<StockChange>) {
  const res = await fetch(withApiBase("/api/stock-change"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create stock-changes");
  return res.json();
}

export async function updateStockChange(id: string, data: Partial<StockChange>) {
  const res = await fetch(withApiBase(`/api/stock-change/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update stock-changes");
  return res.json();
}

export async function deleteStockChange(id: string) {
  const res = await fetch(withApiBase(`/api/stock-change/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete stock-change");
  return res;
} 