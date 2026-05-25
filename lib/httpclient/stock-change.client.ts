import { StockChange, StockChangeFilters } from "@/types";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";

/**
 * Get all stock changes matching the filter, without pagination.
 * @param params 
 * @returns 
 */
export async function getAllStockChangeByFilter(params: StockChangeFilters = {}) {
  const PAGE_LIMIT = 20
  let page = 1
  let total = 0
  let rows: StockChange[] = []

  do {
    const response = await getStockChangeByFilter({
      ...params,
      page,
      limit: PAGE_LIMIT,
    })

    const pageRows = (response.data as StockChange[]) ?? []
    total = Number(response.total ?? 0)
    rows = rows.concat(pageRows)
    page += 1
  } while ((page - 1) * PAGE_LIMIT < total)

  return rows
}

export async function getStockChangeByFilter(params: StockChangeFilters = {}) {
  const url = createApiUrl("/api/stock-change");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch stock-changes");
  return res.json();
}

export async function getStockChangeById(id: string) {
  const res = await fetch(apiHref(`/api/stock-change/${id}`), { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch stock-change detail")
  return res.json()
}

export async function addStockChange(data: Partial<StockChange>) {
  const res = await fetch(apiHref("/api/stock-change"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create stock-changes");
  return res.json();
}

export async function updateStockChange(id: string, data: Partial<StockChange>) {
  const res = await fetch(apiHref(`/api/stock-change/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update stock-changes");
  return res.json();
}

export async function deleteStockChange(id: string) {
  const res = await fetch(apiHref(`/api/stock-change/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete stock-change");
  return res;
} 
