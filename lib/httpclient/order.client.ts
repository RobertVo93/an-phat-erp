import { Order, OrderFilters } from "@/types/order";
import { apiHref, createApiUrl } from "@/lib/httpclient/base";


export async function getOrders(params: OrderFilters = {}) {
  const url = createApiUrl("/api/orders");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function getOrderById(id: string) {
  const res = await fetch(apiHref(`/api/orders/${id}`));
  return res.json();
}

export async function getOrderActivityLogs(orderId: string) {
  const res = await fetch(apiHref(`/api/orders/${orderId}/activity`));
  return res.json();
}

export async function createOrder(data: Partial<Order>) {
  const res = await fetch(apiHref("/api/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const res = await fetch(apiHref(`/api/orders/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function deleteOrder(id: string) {
  const res = await fetch(apiHref(`/api/orders/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete order");
  return res;
} 