export interface Product {
  id: string
  name: string
  description?: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  sku: string
  barcode?: string
  status: "active" | "inactive" | "lowStock" | "outOfStock"
  supplier?: string
  createdAt: string
  updatedAt: string
  image?: string
}

export interface ProductFormData {
  name: string
  description: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  sku: string
  barcode: string
  status: "active" | "inactive"
  supplier: string
  image?: string
}

export interface ProductFilters {
  category?: string
  status?: string
  priceRange?: {
    min: number
    max: number
  }
  stockRange?: {
    min: number
    max: number
  }
}
