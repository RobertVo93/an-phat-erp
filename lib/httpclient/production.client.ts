import { ProductionFilters, ProductionRecord } from "@/types/production";
import { apiHref, createApiUrl, apiFetch } from "@/lib/httpclient/base";

export async function getAllProductions(params: ProductionFilters = {}) {
  const url = createApiUrl("/api/production");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await apiFetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function getTodayProductions() {
  const url = createApiUrl("/api/production/today");
  const res = await apiFetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function getProductionByIdOrNumber(idOrNumber: string) {
  const res = await apiFetch(apiHref(`/api/production/${encodeURIComponent(idOrNumber)}`), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch production detail");
  return res.json();
}

export async function createProduction(data: Partial<ProductionRecord>) {
  const res = await apiFetch(apiHref("/api/production"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create production");
  return res.json();
}

export async function updateProduction(id: string, data: Partial<ProductionRecord>) {
  const res = await apiFetch(apiHref(`/api/production/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update production");
  return res.json();
}
