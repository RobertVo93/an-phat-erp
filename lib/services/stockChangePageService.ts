import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getAllProducts } from "@/lib/services/productService"
import { getAllStockChanges } from "@/lib/services/stockChangeService"
import { getAllWarehouses } from "@/lib/services/warehouseService"
import { Product, ProductStatus, StockChange, StockChangeFilters, StockChangeSortBy, Warehouse, WarehouseStatus } from "@/types"

export interface IStockChangePageData {
  stockChangeRecords: StockChange[]
  products: Product[]
  warehouses: Warehouse[]
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  sortBy: StockChangeSortBy
  sortOrder: "asc" | "desc"
  filters: StockChangeFilters
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_BY: StockChangeSortBy = "date"
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc"

const serializeForClient = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

export async function getStockChangePageData(): Promise<IStockChangePageData> {
  try {
    await ensureDataSource()

    const [stockChangeResult, warehouseResult, productResult] = await Promise.all([
      getAllStockChanges({
        page: DEFAULT_PAGE,
        limit: DEFAULT_PAGE_SIZE,
        sortBy: DEFAULT_SORT_BY,
        sortOrder: DEFAULT_SORT_ORDER,
      }),
      getAllWarehouses({
        page: 1,
        limit: 1000,
        filters: { status: WarehouseStatus.active },
      }),
      getAllProducts({
        page: 1,
        limit: 1000,
        filters: { status: ProductStatus.active },
      }),
    ])

    const total = Number(stockChangeResult.total || 0)

    return serializeForClient({
      stockChangeRecords: stockChangeResult.data as StockChange[],
      products: productResult.data as Product[],
      warehouses: warehouseResult.data as Warehouse[],
      total,
      totalPages: Math.ceil(total / DEFAULT_PAGE_SIZE),
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
      filters: {},
    })
  } catch (error) {
    console.error("[stockChangePageService] Failed to load stock-change page data", error)

    return {
      stockChangeRecords: [],
      products: [],
      warehouses: [],
      total: 0,
      totalPages: 1,
      currentPage: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: DEFAULT_SORT_BY,
      sortOrder: DEFAULT_SORT_ORDER,
      filters: {},
    }
  }
}
