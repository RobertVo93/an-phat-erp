import { PayrollStatus } from "@/types";

export async function getallPayrolls() {
  const url = new URL("/api/payroll", window.location.origin);
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch order");
  return res.json();
}

export async function processOnePayroll(id: string) {
  const res = await fetch(`/api/payroll/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function processPayrolls() {
  const res = await fetch(`/api/payroll`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}