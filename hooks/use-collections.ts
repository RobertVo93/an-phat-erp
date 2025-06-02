"use client"

import { useState, useMemo } from "react"
import type { Collection, CollectionFilters } from "@/types/collection"

const initialCollections: Collection[] = [
  {
    id: "COL-001",
    name: "Summer Collection 2024",
    description: "Latest summer fashion trends and accessories",
    productCount: 25,
    status: "Active",
    createdDate: "2024-01-15",
    totalValue: "$12,500.00",
    category: "Fashion",
    products: [
      { id: "P001", name: "Summer Dress", price: 89.99, category: "Fashion", stock: 15 },
      { id: "P002", name: "Sunglasses", price: 45.0, category: "Fashion", stock: 30 },
    ],
  },
  {
    id: "COL-002",
    name: "Electronics Bundle",
    description: "Premium electronics and gadgets collection",
    productCount: 18,
    status: "Active",
    createdDate: "2024-01-10",
    totalValue: "$45,200.00",
    category: "Electronics",
    products: [
      { id: "P003", name: "Smartphone", price: 899.99, category: "Electronics", stock: 8 },
      { id: "P004", name: "Wireless Headphones", price: 199.99, category: "Electronics", stock: 12 },
    ],
  },
  {
    id: "COL-003",
    name: "Home & Garden",
    description: "Essential items for home improvement and gardening",
    productCount: 32,
    status: "Draft",
    createdDate: "2024-01-08",
    totalValue: "$8,750.00",
    category: "Home",
  },
  {
    id: "COL-004",
    name: "Winter Clearance",
    description: "End of season winter items at discounted prices",
    productCount: 15,
    status: "Archived",
    createdDate: "2023-12-20",
    totalValue: "$3,200.00",
    category: "Fashion",
  },
  {
    id: "COL-005",
    name: "Office Essentials",
    description: "Everything you need for a productive workspace",
    productCount: 22,
    status: "Active",
    createdDate: "2024-01-12",
    totalValue: "$6,800.00",
    category: "Office",
  },
  {
    id: "COL-006",
    name: "Gaming Collection",
    description: "High-performance gaming gear and accessories",
    productCount: 28,
    status: "Active",
    createdDate: "2024-01-20",
    totalValue: "$15,300.00",
    category: "Electronics",
  },
  {
    id: "COL-007",
    name: "Kitchen Appliances",
    description: "Modern kitchen appliances for home cooking",
    productCount: 19,
    status: "Active",
    createdDate: "2024-01-18",
    totalValue: "$9,200.00",
    category: "Home",
  },
  {
    id: "COL-008",
    name: "Workspace Setup",
    description: "Complete workspace setup for remote work",
    productCount: 16,
    status: "Draft",
    createdDate: "2024-01-25",
    totalValue: "$7,400.00",
    category: "Office",
  },
  {
    id: "COL-009",
    name: "Spring Fashion",
    description: "Fresh spring fashion collection",
    productCount: 35,
    status: "Active",
    createdDate: "2024-01-22",
    totalValue: "$18,900.00",
    category: "Fashion",
  },
  {
    id: "COL-010",
    name: "Tech Accessories",
    description: "Essential tech accessories and gadgets",
    productCount: 24,
    status: "Active",
    createdDate: "2024-01-28",
    totalValue: "$11,600.00",
    category: "Electronics",
  },
  {
    id: "COL-011",
    name: "Vintage Collection",
    description: "Curated vintage items and antiques",
    productCount: 12,
    status: "Archived",
    createdDate: "2023-11-15",
    totalValue: "$4,800.00",
    category: "Fashion",
  },
  {
    id: "COL-012",
    name: "Smart Home",
    description: "Smart home devices and automation",
    productCount: 21,
    status: "Active",
    createdDate: "2024-01-30",
    totalValue: "$13,700.00",
    category: "Electronics",
  },
]

export function useCollections() {
  const [allCollections, setAllCollections] = useState<Collection[]>(initialCollections)
  const [filters, setFilters] = useState<CollectionFilters>({
    search: "",
    status: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [sortBy, setSortBy] = useState<keyof Collection>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredCollections = useMemo(() => {
    const filtered = allCollections.filter((collection) => {
      const matchesSearch =
        collection.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        collection.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        collection.id.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = !filters.status || collection.status === filters.status
      const matchesCategory = !filters.category || collection.category === filters.category

      const matchesDateRange = (() => {
        if (!filters.dateFrom && !filters.dateTo) return true
        const collectionDate = new Date(collection.createdDate)
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null
        const toDate = filters.dateTo ? new Date(filters.dateTo) : null

        if (fromDate && collectionDate < fromDate) return false
        if (toDate && collectionDate > toDate) return false
        return true
      })()

      return matchesSearch && matchesStatus && matchesCategory && matchesDateRange
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
  }, [allCollections, filters, sortBy, sortOrder])

  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCollections.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCollections, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)

  const createCollection = (newCollection: Omit<Collection, "id">) => {
    const id = `COL-${String(allCollections.length + 1).padStart(3, "0")}`
    const collection: Collection = {
      ...newCollection,
      id,
    }
    setAllCollections([collection, ...allCollections])
  }

  const updateCollection = (id: string, updatedCollection: Partial<Collection>) => {
    setAllCollections(allCollections.map((col) => (col.id === id ? { ...col, ...updatedCollection } : col)))
  }

  const deleteCollection = (id: string) => {
    setAllCollections(allCollections.filter((col) => col.id !== id))
  }

  const getCollection = (id: string) => {
    return allCollections.find((col) => col.id === id)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      dateFrom: "",
      dateTo: "",
    })
  }

  return {
    collections: paginatedCollections,
    allCollections,
    filteredCollections,
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
    totalCollections: filteredCollections.length,
    createCollection,
    updateCollection,
    deleteCollection,
    getCollection,
    resetFilters,
  }
}
