import { AttendanceRecord } from "@/types";

export async function getAllAttendanceRecords() {
  const url = new URL("/api/attendance", window.location.origin);
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch attendance records");
  return res.json();
}

export async function addAttendanceRecord(data: Partial<AttendanceRecord>) {
  const res = await fetch("/api/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create attendance");
  return res.json();
}

export async function updateAttendanceRecord(id: string, data: Partial<AttendanceRecord>) {
  const res = await fetch(`/api/attendance/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update attendance");
  return res.json();
}

export async function deleteAttendanceRecord(id: string) {
  const res = await fetch(`/api/attendance/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete attendance");
  return res;
} 