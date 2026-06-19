import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getAllCustomers } from "@/lib/services/customerService"
import type { Customer, CustomerFilters } from "@/types/customer"

export interface ICustomerPageData {
  customers: Customer[]
  filters: CustomerFilters
  totalCustomers: number
  currentPage: number
  itemsPerPage: number
  totalPages: number
  totalRevenue: number
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 5
const DEFAULT_SORT_BY = "createdAt"
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc"

const serializeForClient = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const calculateCustomerSpend = (customer: Customer): Customer => {
  const totalSpend = customer.orders?.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0) ?? 0
  return {
    ...customer,
    totalSpend,
  }
}

export async function getCustomerPageData(): Promise<ICustomerPageData> {
  try {
    await ensureDataSource()

    const result = await getAllCustomers({
      page: DEFAULT_PAGE,
      limit: DEFAULT_PAGE_SIZE,
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
    })
    const customers = (result.data as Customer[]).map(calculateCustomerSpend)
    const totalCustomers = Number(result.total || 0)

    return serializeForClient({
      customers,
      filters: {
        sortBy: DEFAULT_SORT_BY,
        sortOrder: DEFAULT_SORT_ORDER,
      },
      totalCustomers,
      currentPage: DEFAULT_PAGE,
      itemsPerPage: DEFAULT_PAGE_SIZE,
      totalPages: Math.ceil(totalCustomers / DEFAULT_PAGE_SIZE),
      totalRevenue: customers.reduce((sum, customer) => sum + (customer.totalSpend ?? 0), 0),
    })
  } catch (error) {
    console.error("[customerPageService] Failed to load customer page data", error)

    return {
      customers: [],
      filters: {
        sortBy: DEFAULT_SORT_BY,
        sortOrder: DEFAULT_SORT_ORDER,
      },
      totalCustomers: 0,
      currentPage: DEFAULT_PAGE,
      itemsPerPage: DEFAULT_PAGE_SIZE,
      totalPages: 1,
      totalRevenue: 0,
    }
  }
}
