import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getAllOrders } from "@/lib/services/orderService"
import { getAllWarehouses } from "@/lib/services/warehouseService"
import { toIsoDate } from "@/lib/utils.date"
import {
  Customer,
  Order,
  OrderFilters,
  OrderSortBy,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  Warehouse,
  WarehouseProduct,
  WarehouseStatus,
} from "@/types"

export interface IOrderPageData {
  orders: Order[]
  warehouses: Warehouse[]
  filters: OrderFilters
  total: number
  totalPages: number
  currentPage: number
  pageSize: number
  sortBy: OrderSortBy
  sortOrder: "asc" | "desc"
}

export type OrderPageSearchParams = Record<string, string | string[] | undefined>

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_SORT_BY: OrderSortBy = "orderDate"
const DEFAULT_SORT_ORDER: "asc" | "desc" = "desc"
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]
const ORDER_SORT_FIELDS: OrderSortBy[] = ["orderDate", "deliveryDate", "totalAmount", "customer", "number"]
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const getSearchParam = (searchParams: OrderPageSearchParams, key: string): string | undefined => {
  const value = searchParams[key]
  return Array.isArray(value) ? value[0] : value
}

const parsePositiveInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const parseAmount = (value: string | undefined): number | undefined => {
  if (!value) return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

const parseEnumValue = <T extends string>(value: string | undefined, values: readonly T[]): T | undefined =>
  value && values.includes(value as T) ? value as T : undefined

const parseDate = (value: string | undefined): string | undefined =>
  value && DATE_PATTERN.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? value
    : undefined

const parseOrderPageQuery = (searchParams: OrderPageSearchParams) => {
  const page = parsePositiveInteger(getSearchParam(searchParams, "page"), DEFAULT_PAGE)
  const requestedPageSize = parsePositiveInteger(getSearchParam(searchParams, "limit"), DEFAULT_PAGE_SIZE)
  const pageSize = PAGE_SIZE_OPTIONS.includes(requestedPageSize) ? requestedPageSize : DEFAULT_PAGE_SIZE
  const sortBy = parseEnumValue(getSearchParam(searchParams, "sortBy"), ORDER_SORT_FIELDS) ?? DEFAULT_SORT_BY
  const sortOrder = parseEnumValue(getSearchParam(searchParams, "sortOrder"), ["asc", "desc"] as const) ?? DEFAULT_SORT_ORDER
  const searchTerm = getSearchParam(searchParams, "searchTerm")?.trim() || undefined
  const customer = getSearchParam(searchParams, "customer")?.trim() || undefined

  const filters: OrderFilters = {
    searchTerm,
    status: parseEnumValue(getSearchParam(searchParams, "status"), Object.values(OrderStatus)),
    paymentStatus: parseEnumValue(getSearchParam(searchParams, "paymentStatus"), Object.values(PaymentStatus)),
    paymentMethod: parseEnumValue(getSearchParam(searchParams, "paymentMethod"), Object.values(PaymentMethod)),
    customer,
    dateFrom: parseDate(getSearchParam(searchParams, "dateFrom")),
    dateTo: parseDate(getSearchParam(searchParams, "dateTo")),
    totalAmountFrom: parseAmount(getSearchParam(searchParams, "totalAmountFrom")),
    totalAmountTo: parseAmount(getSearchParam(searchParams, "totalAmountTo")),
  }

  return { page, pageSize, sortBy, sortOrder, filters }
}

const serializeDate = (value?: Date) => toIsoDate(value) as unknown as Date | undefined

const serializeCustomer = (customer?: Customer): Customer | undefined => {
  if (!customer) return undefined

  return {
    id: customer.id,
    createdAt: serializeDate(customer.createdAt),
    createdBy: customer.createdBy,
    updatedAt: serializeDate(customer.updatedAt),
    updatedBy: customer.updatedBy,
    number: customer.number,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company,
    location: customer.location,
    status: customer.status,
    customerType: customer.customerType,
    joinDate: serializeDate(customer.joinDate),
    lastOrder: serializeDate(customer.lastOrder),
    notes: customer.notes,
  }
}

const serializeProduct = (product?: Product): Product | undefined => {
  if (!product) return undefined

  return {
    id: product.id,
    name: product.name,
    unit: product.unit,
    price: product.price,
    cost: product.cost,
    stock: product.stock,
    minStock: product.minStock,
    sku: product.sku,
    barcode: product.barcode,
    status: product.status,
    supplier: product.supplier,
    image: product.image,
    subImages: product.subImages ?? [],
  }
}

const serializeWarehouseProduct = (warehouseProduct: WarehouseProduct): WarehouseProduct => ({
  id: warehouseProduct.id,
  quantity: warehouseProduct.quantity,
  product: serializeProduct(warehouseProduct.product),
})

const serializeWarehouse = (warehouse: Warehouse): Warehouse => ({
  id: warehouse.id,
  createdAt: serializeDate(warehouse.createdAt),
  createdBy: warehouse.createdBy,
  updatedAt: serializeDate(warehouse.updatedAt),
  updatedBy: warehouse.updatedBy,
  number: warehouse.number,
  name: warehouse.name,
  address: warehouse.address,
  manager: warehouse.manager,
  status: warehouse.status,
  phone: warehouse.phone,
  email: warehouse.email,
  description: warehouse.description,
  main: warehouse.main,
  warehouseProducts: (warehouse.warehouseProducts ?? []).map(serializeWarehouseProduct),
})

const serializeOrder = (order: Order): Order => ({
  id: order.id,
  createdAt: serializeDate(order.createdAt),
  createdBy: order.createdBy,
  updatedAt: serializeDate(order.updatedAt),
  updatedBy: order.updatedBy,
  number: order.number,
  deliveryDate: serializeDate(order.deliveryDate),
  totalAmount: order.totalAmount,
  status: order.status,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  shippingAddress: order.shippingAddress,
  notes: order.notes,
  tags: order.tags ?? [],
  tax: order.tax,
  shippingFee: order.shippingFee,
  items: order.items ?? [],
  customer: serializeCustomer(order.customer),
  receiverInfo: order.receiverInfo,
})

export async function getOrderPageData(searchParams: OrderPageSearchParams = {}): Promise<IOrderPageData> {
  const { page, pageSize, sortBy, sortOrder, filters } = parseOrderPageQuery(searchParams)

  try {
    await ensureDataSource()

    const [orderResult, warehouseResult] = await Promise.all([
      getAllOrders({
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        filters,
      }),
      getAllWarehouses({
        page: 1,
        limit: 1000,
        filters: { status: WarehouseStatus.active },
      }),
    ])
    const total = Number(orderResult.total || 0)

    return {
      orders: (orderResult.data as Order[]).map(serializeOrder),
      warehouses: (warehouseResult.data as Warehouse[]).map(serializeWarehouse),
      filters,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      currentPage: page,
      pageSize,
      sortBy,
      sortOrder,
    }
  } catch (error) {
    console.error("[orderPageService] Failed to load order page data", error)

    return {
      orders: [],
      warehouses: [],
      filters,
      total: 0,
      totalPages: 1,
      currentPage: page,
      pageSize,
      sortBy,
      sortOrder,
    }
  }
}
