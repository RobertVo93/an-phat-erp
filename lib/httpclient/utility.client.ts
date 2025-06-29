import { Utility, UtilityFilters } from "@/types";

export async function getAllUtilities() {
  const url = new URL("/api/utility", window.location.origin);
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch Utilities");
  return res.json();
}

export async function addUtility(data: Partial<Utility>) {
  const res = await fetch("/api/utility", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create Utility");
  return res.json();
}

export async function updateUtility(id: string, data: Partial<Utility>) {
  const res = await fetch(`/api/utility/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update Utility");
  return res.json();
}

export async function deleteUtility(id: string) {
  const res = await fetch(`/api/utility/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete Utility");
  return res;
} 