import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getProductionByIdOrNumber } from "@/lib/services/productionService"
import { getProductionOptions, serializeEmployeeOption, serializeProductOption, serializeWarehouseOption } from "@/lib/services/productionPageService"
import { toIsoDate } from "@/lib/utils"
import type {
  IProductionDetail,
  IProductionDetailEmployee,
  IProductionDetailPageData,
  IProductionDetailProduct,
  IProductionDetailWarehouse,
} from "@/types/production-detail"
import type { ProductionRecord } from "@/types/production"

const serializeProductionDetail = (record: ProductionRecord): IProductionDetail | null => {
  if (!record.id) return null

  return {
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
    product: record.product ? serializeProductOption(record.product) as IProductionDetailProduct : undefined,
    warehouse: record.warehouse ? serializeWarehouseOption(record.warehouse) as IProductionDetailWarehouse : undefined,
    pic: record.pic ? serializeEmployeeOption(record.pic) as IProductionDetailEmployee : undefined,
    materials: record.materials ?? [],
    utilities: record.utilities ?? [],
    labors: record.labors ?? [],
  }
}

export async function getProductionDetailPageData(idOrNumber: string): Promise<IProductionDetailPageData> {
  try {
    await ensureDataSource()

    const [record, options] = await Promise.all([
      getProductionByIdOrNumber(decodeURIComponent(idOrNumber)),
      getProductionOptions(),
    ])

    return {
      record: record ? serializeProductionDetail(record as ProductionRecord) : null,
      ...options,
    }
  } catch (error) {
    console.error("[productionDetailPageService] Failed to load production detail", { idOrNumber, error })

    return {
      record: null,
      availableProducts: [],
      availableMaterials: [],
      availableUtilities: [],
      availableEmployees: [],
      availableWarehouses: [],
    }
  }
}
