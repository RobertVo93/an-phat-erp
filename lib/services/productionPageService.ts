import { ensureDataSource } from "@/lib/database/ensureDataSource"
import { getEmployeeByFilter } from "@/lib/services/employeeService"
import { getAllProducts } from "@/lib/services/productService"
import { getTodayProductions } from "@/lib/services/productionService"
import { getUtilitiesService } from "@/lib/services/utilityService"
import { getAllWarehouses } from "@/lib/services/warehouseService"
import type { IProductionElement, ProductionRecord } from "@/types/production"
import type { Employee, Product, Utility, Warehouse, WarehouseProduct } from "@/types"
import { EmployeeStatus, ProductStatus, UtilityStatus, WarehouseStatus } from "@/types"
import type { IProductionPageData, IProductionPageSummary } from "@/types/production-page"
import { toIsoDate } from "@/lib/utils"

const ACTIVE_OPTION_LIMIT = 1000

const sumElements = (elements?: IProductionElement[]) =>
  (elements ?? []).reduce((sum, element) => sum + (element.totalCost ?? 0), 0)

export const calculateProductionSummary = (records: ProductionRecord[]): IProductionPageSummary => ({
  materialCost: records.reduce((sum, record) => sum + sumElements(record.materials), 0),
  utilityCost: records.reduce((sum, record) => sum + sumElements(record.utilities), 0),
  employeeCost: records.reduce((sum, record) => sum + sumElements(record.labors), 0),
})

export const serializeProductOption = (product: Product): Product => ({
  id: product.id,
  name: product.name,
  unit: product.unit,
  description: product.description,
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
})

const serializeWarehouseProductOption = (warehouseProduct: WarehouseProduct): WarehouseProduct => ({
  id: warehouseProduct.id,
  quantity: warehouseProduct.quantity,
  product: warehouseProduct.product ? serializeProductOption(warehouseProduct.product) : undefined,
})

export const serializeWarehouseOption = (warehouse: Warehouse): Warehouse => ({
  id: warehouse.id,
  number: warehouse.number,
  name: warehouse.name,
  address: warehouse.address,
  manager: warehouse.manager,
  status: warehouse.status,
  phone: warehouse.phone,
  email: warehouse.email,
  description: warehouse.description,
  main: warehouse.main,
  warehouseProducts: (warehouse.warehouseProducts ?? []).map(serializeWarehouseProductOption),
})

export const serializeUtilityOption = (utility: Utility): Utility => ({
  id: utility.id,
  number: utility.number,
  name: utility.name,
  provider: utility.provider,
  location: utility.location,
  unit: utility.unit,
  costPerUnit: utility.costPerUnit,
  status: utility.status,
  description: utility.description,
})

export const serializeEmployeeOption = (employee: Employee): Employee => ({
  id: employee.id,
  number: employee.number,
  name: employee.name,
  email: employee.email,
  phone: employee.phone,
  position: employee.position,
  department: employee.department,
  salary: employee.salary,
  employeeType: employee.employeeType,
  status: employee.status,
  address: employee.address,
  emergencyContact: employee.emergencyContact,
  notes: employee.notes,
})

export const serializeProductionRecord = (record: ProductionRecord): ProductionRecord => ({
  id: record.id,
  createdAt: toIsoDate(record.createdAt) as unknown as Date,
  createdBy: record.createdBy,
  updatedAt: toIsoDate(record.updatedAt) as unknown as Date,
  updatedBy: record.updatedBy,
  number: record.number,
  date: toIsoDate(record.date) as unknown as Date,
  quantity: record.quantity,
  status: record.status,
  totalCost: record.totalCost,
  totalExpense: record.totalExpense,
  product: record.product ? serializeProductOption(record.product) : undefined,
  warehouse: record.warehouse ? serializeWarehouseOption(record.warehouse) : undefined,
  pic: record.pic ? serializeEmployeeOption(record.pic) : undefined,
  materials: record.materials ?? [],
  utilities: record.utilities ?? [],
  labors: record.labors ?? [],
})

export async function getProductionOptions() {
  const [productResult, utilityResult, employeeResult, warehouseResult] = await Promise.all([
    getAllProducts({
      page: 1,
      limit: ACTIVE_OPTION_LIMIT,
      filters: { status: ProductStatus.active },
    }),
    getUtilitiesService({
      page: 1,
      limit: ACTIVE_OPTION_LIMIT,
      filters: { status: UtilityStatus.active },
    }),
    getEmployeeByFilter({
      page: 1,
      limit: ACTIVE_OPTION_LIMIT,
      filters: { status: EmployeeStatus.active },
    }),
    getAllWarehouses({
      page: 1,
      limit: ACTIVE_OPTION_LIMIT,
      filters: { status: WarehouseStatus.active },
    }),
  ])

  const products = (productResult.data as Product[]).map(serializeProductOption)

  return {
    availableProducts: products,
    availableMaterials: products,
    availableUtilities: (utilityResult.data as Utility[]).map(serializeUtilityOption),
    availableEmployees: (employeeResult.data as Employee[]).map(serializeEmployeeOption),
    availableWarehouses: (warehouseResult.data as Warehouse[]).map(serializeWarehouseOption),
  }
}

export async function getProductionPageData(): Promise<IProductionPageData> {
  try {
    await ensureDataSource()

    const [todayRecords, options] = await Promise.all([
      getTodayProductions(),
      getProductionOptions(),
    ])
    const serializedRecords = (todayRecords as ProductionRecord[]).map(serializeProductionRecord)

    return {
      todayRecords: serializedRecords,
      ...options,
      summary: calculateProductionSummary(serializedRecords),
    }
  } catch (error) {
    console.error("[productionPageService] Failed to load produce page data", error)

    return {
      todayRecords: [],
      availableProducts: [],
      availableMaterials: [],
      availableUtilities: [],
      availableEmployees: [],
      availableWarehouses: [],
      summary: {
        materialCost: 0,
        utilityCost: 0,
        employeeCost: 0,
      },
    }
  }
}
