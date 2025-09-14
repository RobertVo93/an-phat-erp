import { Order, OrderFilters } from "@/types/order";


export async function getOrders(params: OrderFilters = {}) {
  const url = new URL("/api/orders", window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function getOrderById(id: string) {
  const res = await fetch(`/api/orders/${id}`);
  return res.json();
}

export async function getOrderActivityLogs(orderId: string) {
  const res = await fetch(`/api/orders/${orderId}/activity`);
  return res.json();
}

export async function createOrder(data: Partial<Order>) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function deleteOrder(id: string) {
  const res = await fetch(`/api/orders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete order");
  return res;
} 