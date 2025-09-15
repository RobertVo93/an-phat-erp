import type { Collection, CollectionFilters } from "@/types/collection";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";

export async function getCollections(params: CollectionFilters = {}) {
  const url = createApiUrl("/api/collections");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}

export async function getCollectionById(id: string) {
  const res = await fetch(apiHref(`/api/collections/${id}`), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch collection");
  return res.json();
}

export async function createCollection(data: Partial<Collection>) {
  const res = await fetch(apiHref("/api/collections"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create collection");
  return res.json();
}

export async function updateCollection(id: string, data: Partial<Collection>) {
  const res = await fetch(apiHref(`/api/collections/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update collection");
  return res.json();
}

export async function deleteCollection(id: string) {
  const res = await fetch(apiHref(`/api/collections/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete collection");
  return res;
} 