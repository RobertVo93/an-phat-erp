import { apiHref, createApiUrl } from "@/lib/httpclient/base";
import { IUtilityUsage, IUtilityUsageFilters } from "@/types";
import { formatYYYYMMDD } from "@/lib/utils";

/**
 * Get all utility usages matching the filter, without pagination.
 */
export async function getAllUtilityUsagesByFilter(
  params: IUtilityUsageFilters = {}
) {
  const PAGE_LIMIT = 50;
  let page = 1;
  let total = 0;
  let rows: IUtilityUsage[] = [];

  do {
    const response = await getUtilityUsagesByFilter({
      ...params,
      page,
      limit: PAGE_LIMIT,
    });

    const pageRows = (response.data as IUtilityUsage[]) ?? [];
    total = Number(response.total ?? 0);
    rows = rows.concat(pageRows);
    page += 1;
  } while ((page - 1) * PAGE_LIMIT < total);

  return rows;
}

export async function getUtilityUsagesByFilter(
  params: IUtilityUsageFilters = {}
) {
  const url = createApiUrl("/api/utility-usage");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (value instanceof Date) {
        url.searchParams.append(key, formatYYYYMMDD(value));
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });

  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch utility usages");
  return res.json();
}

export async function getUtilityUsageById(idOrNumber: string) {
  const res = await fetch(apiHref(`/api/utility-usage/${idOrNumber}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch utility usage detail");
  return res.json();
}

export async function addUtilityUsage(data: Partial<IUtilityUsage>) {
  const res = await fetch(apiHref("/api/utility-usage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create utility usage");
  return res.json();
}

export async function updateUtilityUsage(
  id: string,
  data: Partial<IUtilityUsage>
) {
  const res = await fetch(apiHref(`/api/utility-usage/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update utility usage");
  return res.json();
}

export async function deleteUtilityUsage(id: string) {
  const res = await fetch(apiHref(`/api/utility-usage/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete utility usage");
  return res;
}
