import { Product, ProductFilters } from "@/types/product";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";

/**
 * Get all products matching the filter, without pagination.
 * @param params 
 * @returns 
 */
export async function getAllProductsByFilter(params: ProductFilters = {}) {
  const PAGE_LIMIT = 20
  let page = 1
  let total = 0
  let rows: Product[] = []

  do {
    const response = await getProducts({
      ...params,
      page,
      limit: PAGE_LIMIT,
    })

    const pageRows = (response.data as Product[]) ?? []
    total = Number(response.total ?? 0)
    rows = rows.concat(pageRows)
    page += 1
  } while ((page - 1) * PAGE_LIMIT < total)

  return rows
}

export async function getProducts(params: ProductFilters = {}) {
  const url = createApiUrl("/api/products");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (key === "priceRange" || key === "stockRange") {
        url.searchParams.append(key, JSON.stringify(value));
      } else {
        url.searchParams.append(key, String(value));
      }
    }
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(id: string) {
  const res = await fetch(apiHref(`/api/products/${id}`));
  return res.json();
}

export async function createProduct(data: Partial<Product>) {
  const res = await fetch(apiHref("/api/products"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create products");
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const res = await fetch(apiHref(`/api/products/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update products");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(apiHref(`/api/products/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete products");
  return res;
} 