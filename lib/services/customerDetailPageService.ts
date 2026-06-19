import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getCustomerById } from "@/lib/services/customerService"
import { getAllOrders } from "@/lib/services/orderService"
import type { Customer, Order, OrderSortBy } from "@/types"

export interface ICustomerDetailPageData {
  customer: Customer | null
  orders: Order[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  sortBy: OrderSortBy
  sortOrder: "asc" | "desc"
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_BY: OrderSortBy = "deliveryDate"
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc"

const serializeForClient = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

export async function getCustomerDetailPageData(id: string): Promise<ICustomerDetailPageData> {
  try {
    await ensureDataSource()

    const [customer, orderResult] = await Promise.all([
      getCustomerById(id),
      getAllOrders({
        customerId: id,
        page: DEFAULT_PAGE,
        limit: DEFAULT_PAGE_SIZE,
        sortBy: DEFAULT_SORT_BY,
        sortOrder: DEFAULT_SORT_ORDER,
      }),
    ])

    const total = Number(orderResult.total || 0)

    return serializeForClient({
      customer: customer || null,
      orders: orderResult.data as Order[],
      total,
      totalPages: Math.ceil(total / DEFAULT_PAGE_SIZE),
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
    })
  } catch (error) {
    console.error("[customerDetailPageService] Failed to load customer detail page data", { id, error })

    return {
      customer: null,
      orders: [],
      total: 0,
      totalPages: 1,
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
    }
  }
}
