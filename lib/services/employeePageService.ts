import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getEmployeeByFilter } from "@/lib/services/employeeService"
import { toIsoDate } from "@/lib/utils.date"
import { EmployeeStatus, EmployeeType } from "@/types"
import type { Employee, EmployeeFilters, EmployeeSortBy } from "@/types/employee"

export type EmployeePageSearchParams = Record<string, string | string[] | undefined>

export interface IEmployeePageData {
  employees: Employee[]
  filters: EmployeeFilters
  totalEmployees: number
  currentPage: number
  itemsPerPage: number
  totalPages: number
  sortBy: EmployeeSortBy
  sortOrder: "asc" | "desc"
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_BY: EmployeeSortBy = "createdAt"
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc"
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]
const SORT_FIELDS: EmployeeSortBy[] = [
  "createdAt",
  "name",
  "position",
  "department",
  "salary",
  "status",
  "employeeType",
]
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const getSearchParam = (searchParams: EmployeePageSearchParams, key: string): string | undefined => {
  const value = searchParams[key]
  return Array.isArray(value) ? value[0] : value
}

const parsePositiveInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

const parseDate = (value: string | undefined): string | undefined =>
  value && DATE_PATTERN.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? value
    : undefined

const parseEnum = <T extends string>(value: string | undefined, values: readonly T[]): T | undefined =>
  value && values.includes(value as T) ? value as T : undefined

const parseEmployeePageQuery = (searchParams: EmployeePageSearchParams) => {
  const page = parsePositiveInteger(getSearchParam(searchParams, "page"), DEFAULT_PAGE)
  const requestedPageSize = parsePositiveInteger(getSearchParam(searchParams, "limit"), DEFAULT_PAGE_SIZE)
  const itemsPerPage = PAGE_SIZE_OPTIONS.includes(requestedPageSize) ? requestedPageSize : DEFAULT_PAGE_SIZE
  const sortBy = parseEnum(getSearchParam(searchParams, "sortBy"), SORT_FIELDS) ?? DEFAULT_SORT_BY
  const sortOrder = parseEnum(getSearchParam(searchParams, "sortOrder"), ["asc", "desc"] as const) ?? DEFAULT_SORT_ORDER

  const filters: EmployeeFilters = {
    name: getSearchParam(searchParams, "name")?.trim() || undefined,
    status: parseEnum(getSearchParam(searchParams, "status"), Object.values(EmployeeStatus)),
    employeeType: parseEnum(getSearchParam(searchParams, "employeeType"), Object.values(EmployeeType)),
    department: getSearchParam(searchParams, "department")?.trim() || undefined,
    position: getSearchParam(searchParams, "position")?.trim() || undefined,
    hireDateFrom: parseDate(getSearchParam(searchParams, "hireDateFrom")),
    hireDateTo: parseDate(getSearchParam(searchParams, "hireDateTo")),
    salaryMin: parseNumber(getSearchParam(searchParams, "salaryMin")),
    salaryMax: parseNumber(getSearchParam(searchParams, "salaryMax")),
    sortBy,
    sortOrder,
  }

  return { page, itemsPerPage, sortBy, sortOrder, filters }
}

const serializeDate = (value?: Date): Date | undefined =>
  toIsoDate(value) as unknown as Date | undefined

const serializeEmployee = (employee: Employee): Employee => ({
  id: employee.id,
  createdAt: serializeDate(employee.createdAt),
  createdBy: employee.createdBy,
  updatedAt: serializeDate(employee.updatedAt),
  updatedBy: employee.updatedBy,
  number: employee.number,
  name: employee.name,
  email: employee.email,
  phone: employee.phone,
  position: employee.position,
  department: employee.department,
  salary: employee.salary,
  hireDate: serializeDate(employee.hireDate),
  employeeType: employee.employeeType,
  status: employee.status,
  address: employee.address,
  emergencyContact: employee.emergencyContact,
  notes: employee.notes,
})

export async function getEmployeePageData(
  searchParams: EmployeePageSearchParams = {},
): Promise<IEmployeePageData> {
  const { page, itemsPerPage, sortBy, sortOrder, filters } = parseEmployeePageQuery(searchParams)

  try {
    await ensureDataSource()
    const result = await getEmployeeByFilter({
      page,
      limit: itemsPerPage,
      sortBy,
      sortOrder,
      filters: { ...filters },
    })
    const totalEmployees = Number(result.total || 0)

    return {
      employees: (result.data as Employee[]).map(serializeEmployee),
      filters,
      totalEmployees,
      currentPage: page,
      itemsPerPage,
      totalPages: Math.max(1, Math.ceil(totalEmployees / itemsPerPage)),
      sortBy,
      sortOrder,
    }
  } catch (error) {
    console.error("[employeePageService] Failed to load employee page data", { searchParams, error })
    return {
      employees: [],
      filters,
      totalEmployees: 0,
      currentPage: page,
      itemsPerPage,
      totalPages: 1,
      sortBy,
      sortOrder,
    }
  }
}
