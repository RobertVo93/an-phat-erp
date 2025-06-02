"use client"

import { useState, useMemo } from "react"
import type { Product, ProductFormData, ProductFilters } from "@/types/product"

// Mock data
const mockProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Laptop Dell XPS 13",
    description: "High-performance ultrabook with Intel Core i7",
    category: "electronics",
    price: 999,
    cost: 750,
    stock: 25,
    minStock: 5,
    sku: "DELL-XPS13-001",
    barcode: "1234567890123",
    status: "active",
    supplier: "Dell Technologies",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "PRD-002",
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip",
    category: "electronics",
    price: 1199,
    cost: 900,
    stock: 15,
    minStock: 3,
    sku: "APPLE-IP15P-001",
    barcode: "2345678901234",
    status: "active",
    supplier: "Apple Inc.",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "PRD-003",
    name: "Office Chair",
    description: "Ergonomic office chair with lumbar support",
    category: "furniture",
    price: 299,
    cost: 180,
    stock: 8,
    minStock: 10,
    sku: "CHAIR-ERG-001",
    barcode: "3456789012345",
    status: "lowStock",
    supplier: "Office Furniture Co.",
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-22T13:20:00Z",
  },
  {
    id: "PRD-004",
    name: "Wireless Mouse",
    description: "Bluetooth wireless mouse with precision tracking",
    category: "accessories",
    price: 49,
    cost: 25,
    stock: 0,
    minStock: 15,
    sku: "MOUSE-WL-001",
    barcode: "4567890123456",
    status: "outOfStock",
    supplier: "Tech Accessories Ltd.",
    createdAt: "2024-01-08T14:00:00Z",
    updatedAt: "2024-01-25T10:15:00Z",
  },
  {
    id: "PRD-005",
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with timer",
    category: "appliances",
    price: 89,
    cost: 55,
    stock: 12,
    minStock: 5,
    sku: "COFFEE-AUTO-001",
    barcode: "5678901234567",
    status: "active",
    supplier: "Kitchen Appliances Inc.",
    createdAt: "2024-01-12T08:30:00Z",
    updatedAt: "2024-01-19T15:00:00Z",
  },
  {
    id: "PRD-006",
    name: "Gaming Keyboard",
    description: "Mechanical gaming keyboard with RGB lighting",
    category: "accessories",
    price: 129,
    cost: 80,
    stock: 20,
    minStock: 8,
    sku: "KB-GAMING-001",
    barcode: "6789012345678",
    status: "active",
    supplier: "Gaming Gear Co.",
    createdAt: "2024-01-14T11:00:00Z",
    updatedAt: "2024-01-21T09:30:00Z",
  },
  {
    id: "PRD-007",
    name: "Smartphone Samsung Galaxy",
    description: "Latest Samsung Galaxy with advanced camera",
    category: "electronics",
    price: 899,
    cost: 650,
    stock: 18,
    minStock: 5,
    sku: "SAMSUNG-GAL-001",
    barcode: "7890123456789",
    status: "active",
    supplier: "Samsung Electronics",
    createdAt: "2024-01-16T14:00:00Z",
    updatedAt: "2024-01-23T16:45:00Z",
  },
  {
    id: "PRD-008",
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness",
    category: "furniture",
    price: 45,
    cost: 28,
    stock: 35,
    minStock: 10,
    sku: "LAMP-DESK-001",
    barcode: "8901234567890",
    status: "active",
    supplier: "Lighting Solutions",
    createdAt: "2024-01-18T10:30:00Z",
    updatedAt: "2024-01-25T12:15:00Z",
  },
  {
    id: "PRD-009",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with premium sound",
    category: "electronics",
    price: 79,
    cost: 45,
    stock: 22,
    minStock: 8,
    sku: "SPEAKER-BT-001",
    barcode: "9012345678901",
    status: "active",
    supplier: "Audio Tech Ltd.",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-26T11:30:00Z",
  },
  {
    id: "PRD-010",
    name: "Monitor 27 inch",
    description: "4K UHD monitor for professional work",
    category: "electronics",
    price: 349,
    cost: 220,
    stock: 12,
    minStock: 5,
    sku: "MONITOR-27-001",
    barcode: "0123456789012",
    status: "active",
    supplier: "Display Technologies",
    createdAt: "2024-01-22T13:45:00Z",
    updatedAt: "2024-01-27T15:20:00Z",
  },
  {
    id: "PRD-011",
    name: "Tablet iPad Air",
    description: "Apple iPad Air with M1 chip",
    category: "electronics",
    price: 599,
    cost: 450,
    stock: 8,
    minStock: 3,
    sku: "IPAD-AIR-001",
    barcode: "1234567890124",
    status: "lowStock",
    supplier: "Apple Inc.",
    createdAt: "2024-01-24T08:15:00Z",
    updatedAt: "2024-01-28T10:45:00Z",
  },
  {
    id: "PRD-012",
    name: "Webcam HD",
    description: "1080p HD webcam for video conferencing",
    category: "accessories",
    price: 69,
    cost: 40,
    stock: 0,
    minStock: 12,
    sku: "WEBCAM-HD-001",
    barcode: "2345678901235",
    status: "outOfStock",
    supplier: "Video Tech Solutions",
    createdAt: "2024-01-26T12:30:00Z",
    updatedAt: "2024-01-29T14:00:00Z",
  },
]

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ProductFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Product>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      // Category filter
      const matchesCategory = !filters.category || product.category === filters.category

      // Status filter
      const matchesStatus = !filters.status || product.status === filters.status

      // Price range filter
      const matchesPrice =
        !filters.priceRange || (product.price >= filters.priceRange.min && product.price <= filters.priceRange.max)

      // Stock range filter
      const matchesStock =
        !filters.stockRange || (product.stock >= filters.stockRange.min && product.stock <= filters.stockRange.max)

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesStock
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [allProducts, searchTerm, filters, sortBy, sortOrder])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const createProduct = async (data: ProductFormData): Promise<void> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProduct: Product = {
        id: `PRD-${String(allProducts.length + 1).padStart(3, "0")}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: data.stock <= 0 ? "outOfStock" : data.stock <= data.minStock ? "lowStock" : data.status,
      }

      setAllProducts((prev) => [...prev, newProduct])
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, data: ProductFormData): Promise<void> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAllProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                ...data,
                updatedAt: new Date().toISOString(),
                status: data.stock <= 0 ? "outOfStock" : data.stock <= data.minStock ? "lowStock" : data.status,
              }
            : product,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAllProducts((prev) => prev.filter((product) => product.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const getProduct = (id: string): Product | undefined => {
    return allProducts.find((product) => product.id === id)
  }

  return {
    products: paginatedProducts,
    allProducts,
    filteredProducts,
    loading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    totalPages,
    totalProducts: filteredProducts.length,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  }
}
