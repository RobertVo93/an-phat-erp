import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getEmployeeByIdOrNumber } from "@/lib/services/employeeService"
import { toIsoDate } from "@/lib/utils.date"
import type { AttendanceRecord } from "@/types/attendance"
import type { Employee } from "@/types/employee"
import type {
  IEmployeeDetail,
  IEmployeeDetailAttendance,
  IEmployeeDetailPageData,
  IEmployeeDetailProduction,
} from "@/types/employee-detail"
import type { ProductionRecord } from "@/types/production"

const serializeAttendance = (record: AttendanceRecord): IEmployeeDetailAttendance => ({
  id: record.id,
  createdAt: toIsoDate(record.createdAt),
  createdBy: record.createdBy,
  updatedAt: toIsoDate(record.updatedAt),
  updatedBy: record.updatedBy,
  number: record.number,
  date: toIsoDate(record.date),
  checkIn: toIsoDate(record.checkIn),
  checkOut: toIsoDate(record.checkOut),
  shift: record.shift,
  status: record.status,
  subStatus: record.subStatus,
  notes: record.notes,
  workHours: record.workHours,
  paidAmount: record.paidAmount,
})

const serializeProduction = (record: ProductionRecord): IEmployeeDetailProduction => ({
  id: record.id,
  createdAt: toIsoDate(record.createdAt),
  createdBy: record.createdBy,
  updatedAt: toIsoDate(record.updatedAt),
  updatedBy: record.updatedBy,
  number: record.number,
  date: toIsoDate(record.date),
  quantity: record.quantity,
  status: record.status,
  totalCost: record.totalCost,
  totalExpense: record.totalExpense,
  materials: record.materials ?? [],
  utilities: record.utilities ?? [],
  labors: record.labors ?? [],
  product: record.product
    ? { id: record.product.id, name: record.product.name }
    : undefined,
  warehouse: record.warehouse
    ? { id: record.warehouse.id, number: record.warehouse.number, name: record.warehouse.name }
    : undefined,
})

const serializeEmployee = (employee: Employee): IEmployeeDetail | null => {
  if (!employee.id) return null

  return {
    id: employee.id,
    createdAt: toIsoDate(employee.createdAt),
    createdBy: employee.createdBy,
    updatedAt: toIsoDate(employee.updatedAt),
    updatedBy: employee.updatedBy,
    number: employee.number,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    position: employee.position,
    department: employee.department,
    salary: employee.salary,
    hireDate: toIsoDate(employee.hireDate),
    employeeType: employee.employeeType,
    status: employee.status,
    address: employee.address,
    emergencyContact: employee.emergencyContact,
    notes: employee.notes,
    attendanceRecords: (employee.attendanceRecords ?? []).map(serializeAttendance),
    productionRecords: (employee.productionRecords ?? []).map(serializeProduction),
  }
}

export async function getEmployeeDetailPageData(idOrNumber: string): Promise<IEmployeeDetailPageData> {
  try {
    await ensureDataSource()
    const employee = await getEmployeeByIdOrNumber(decodeURIComponent(idOrNumber))

    return {
      employee: employee ? serializeEmployee(employee as Employee) : null,
    }
  } catch (error) {
    console.error("[employeeDetailPageService] Failed to load employee detail", { idOrNumber, error })
    return { employee: null }
  }
}
