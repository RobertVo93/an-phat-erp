import { ProductionRecord } from "@/types/production";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";

export async function getAllProductions() {
  const url = createApiUrl("/api/production");
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function createProduction(data: Partial<ProductionRecord>) {
  const res = await fetch(apiHref("/api/production"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create production");
  return res.json();
}

export async function updateProduction(id: string, data: Partial<ProductionRecord>) {
  const res = await fetch(apiHref(`/api/production/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update production");
  return res.json();
}