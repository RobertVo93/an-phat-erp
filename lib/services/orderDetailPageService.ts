import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getActivityLogsByTargetIdService } from "@/lib/services/activityLogService"
import { getAllCustomers } from "@/lib/services/customerService"
import { getOrderById } from "@/lib/services/orderService"
import { getAllWarehouses } from "@/lib/services/warehouseService"
import { Customer, CustomerStatus, IActivityLog, Order, ResourceType, Warehouse, WarehouseStatus } from "@/types"

export interface IOrderDetailPageData {
  order: Order | null
  orderActivityLogs: IActivityLog[]
  allCustomers: Customer[]
  allWarehouses: Warehouse[]
}

const serializeForClient = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

export async function getOrderDetailPageData(id: string): Promise<IOrderDetailPageData> {
  try {
    await ensureDataSource()

    const [order, orderActivityLogs, customersResult, warehousesResult] = await Promise.all([
      getOrderById(id),
      getActivityLogsByTargetIdService(ResourceType.order, id),
      getAllCustomers({
        page: 1,
        limit: 1000,
        filters: { status: CustomerStatus.active },
      }),
      getAllWarehouses({
        page: 1,
        limit: 1000,
        filters: { status: WarehouseStatus.active },
      }),
    ])

    return serializeForClient({
      order: order as Order | null,
      orderActivityLogs: orderActivityLogs as IActivityLog[],
      allCustomers: customersResult.data as Customer[],
      allWarehouses: warehousesResult.data as Warehouse[],
    })
  } catch (error) {
    console.error("[orderDetailPageService] Failed to load order detail page data", { id, error })
    return {
      order: null,
      orderActivityLogs: [],
      allCustomers: [],
      allWarehouses: [],
    }
  }
}
