export interface Warehouse {
  id: string
  name: string
  location: string
  address: string
  manager: string
  capacity: number
  occupied: number
  status: "Active" | "Maintenance" | "Inactive"
  type: "Distribution Center" | "Regional Hub" | "Cold Storage" | "Backup Storage"
  zones: number
  temperature: "Ambient" | "Refrigerated" | "Frozen"
  phone?: string
  email?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface WarehouseFilters {
  status?: string
  type?: string
  temperature?: string
  location?: string
  utilizationRange?: [number, number]
}

export interface WarehouseSortOption {
  field: keyof Warehouse
  direction: "asc" | "desc"
}
