import { ProductionRecord } from "@/types/production";

export async function getAllProductions() {
  const url = new URL("/api/production", window.location.origin);
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function createProduction(data: Partial<ProductionRecord>) {
  const res = await fetch("/api/production", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create production");
  return res.json();
}

export async function updateProduction(id: string, data: Partial<ProductionRecord>) {
  const res = await fetch(`/api/production/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update production");
  return res.json();
}