import { AttendanceRecord, AttendanceFilters } from "@/types";
import { withApiBase } from "@/lib/base-path";

export async function getAllAttendanceRecords(params: AttendanceFilters = {}) {
  const url = new URL(withApiBase("/api/attendance"), window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
  });
  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch attendance records");
  return res.json();
}

export async function addAttendanceRecord(data: Partial<AttendanceRecord>) {
  const res = await fetch(withApiBase("/api/attendance"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create attendance");
  return res.json();
}

export async function updateAttendanceRecord(id: string, data: Partial<AttendanceRecord>) {
  const res = await fetch(withApiBase(`/api/attendance/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update attendance");
  return res.json();
}

export async function deleteAttendanceRecord(id: string) {
  const res = await fetch(withApiBase(`/api/attendance/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete attendance");
  return res;
} 