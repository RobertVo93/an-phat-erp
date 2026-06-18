import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getAllProducts } from "@/lib/services/productService"
import { getStockChangeById } from "@/lib/services/stockChangeService"
import { getAllWarehouses } from "@/lib/services/warehouseService"
import { Product, ProductStatus, Warehouse, WarehouseStatus } from "@/types"
import type { StockChange } from "@/types/stock-change"
import type {
  IStockChangeDetail,
  IStockChangeDetailPageData,
  IStockChangeDetailProductionRecord,
  IStockChangeDetailWarehouse,
} from "@/types/stock-change-detail"
import { toIsoDate } from "../utils"

const serializeWarehouse = (warehouse: StockChange["warehouse"]): IStockChangeDetailWarehouse | undefined => {
  if (!warehouse) return undefined

  return {
    id: warehouse.id,
    createdAt: toIsoDate(warehouse.createdAt),
    createdBy: warehouse.createdBy,
    updatedAt: toIsoDate(warehouse.updatedAt),
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
  }
}

const serializeProductionRecord = (
  productionRecord: StockChange["productionRecord"],
): IStockChangeDetailProductionRecord | undefined => {
  if (!productionRecord) return undefined

  return {
    id: productionRecord.id,
    createdAt: toIsoDate(productionRecord.createdAt),
    createdBy: productionRecord.createdBy,
    updatedAt: toIsoDate(productionRecord.updatedAt),
    updatedBy: productionRecord.updatedBy,
    number: productionRecord.number,
    date: toIsoDate(productionRecord.date),
    quantity: productionRecord.quantity,
    status: productionRecord.status,
    totalCost: productionRecord.totalCost,
    totalExpense: productionRecord.totalExpense,
    materials: productionRecord.materials,
    utilities: productionRecord.utilities,
    labors: productionRecord.labors,
  }
}

const serializeStockChange = (record: StockChange): IStockChangeDetail | null => {
  if (!record.id) return null

  return {
    id: record.id,
    createdAt: toIsoDate(record.createdAt),
    createdBy: record.createdBy,
    updatedAt: toIsoDate(record.updatedAt),
    updatedBy: record.updatedBy,
    number: record.number,
    type: record.type,
    date: toIsoDate(record.date),
    supplier: record.supplier,
    warehouse: serializeWarehouse(record.warehouse),
    productionRecord: serializeProductionRecord(record.productionRecord),
    status: record.status,
    stockProducts: record.stockProducts ?? [],
    subtotal: record.subtotal,
    tax: record.tax,
    discount: record.discount,
    totalAmount: record.totalAmount,
    notes: record.notes,
    receivedBy: record.receivedBy,
    receivedDate: toIsoDate(record.receivedDate),
  }
}

const serializeProductOption = (product: Product): Product => ({
  id: product.id,
  name: product.name,
  sku: product.sku,
  unit: product.unit,
  price: product.price,
  cost: product.cost,
  status: product.status,
})

const serializeWarehouseOption = (warehouse: Warehouse): Warehouse => ({
  id: warehouse.id,
  number: warehouse.number,
  name: warehouse.name,
  status: warehouse.status,
  main: warehouse.main,
})

export async function getStockChangeDetailPageData(id: string): Promise<IStockChangeDetailPageData> {
  try {
    await ensureDataSource()
    const [record, productResult, warehouseResult] = await Promise.all([
      getStockChangeById(id),
      getAllProducts({
        page: 1,
        limit: 1000,
        filters: { status: ProductStatus.active },
      }),
      getAllWarehouses({
        page: 1,
        limit: 1000,
        filters: { status: WarehouseStatus.active },
      }),
    ])

    return {
      record: record ? serializeStockChange(record) : null,
      products: (productResult.data as Product[]).map(serializeProductOption),
      warehouses: (warehouseResult.data as Warehouse[]).map(serializeWarehouseOption),
    }
  } catch (error) {
    console.error("[stockChangeDetailPageService] Failed to load stock-change detail", { id, error })
    return {
      record: null,
      products: [],
      warehouses: [],
    }
  }
}
