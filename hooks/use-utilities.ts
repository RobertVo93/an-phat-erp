"use client"

import { useState, useMemo } from "react"
import type { Utility, UtilityFilters, UtilitySortField, SortDirection } from "@/types/utility"

// Mock data for utilities
const mockUtilities: Utility[] = [
  {
    id: "UTIL-001",
    type: "Electricity",
    provider: "Vietnam Electricity",
    accountNumber: "ELC-123456789",
    location: "Main Warehouse",
    monthlyUsage: 2500,
    unit: "kWh",
    costPerUnit: 0.12,
    monthlyCost: 300,
    lastReading: "2024-01-15",
    status: "Active",
    dueDate: "2024-02-15",
    description: "Main warehouse electricity supply",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "UTIL-002",
    type: "Water",
    provider: "Saigon Water Corporation",
    accountNumber: "WTR-987654321",
    location: "Main Warehouse",
    monthlyUsage: 150,
    unit: "m³",
    costPerUnit: 2.5,
    monthlyCost: 375,
    lastReading: "2024-01-15",
    status: "Active",
    dueDate: "2024-02-10",
    description: "Water supply for main facility",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "UTIL-003",
    type: "Gas",
    provider: "PetroVietnam Gas",
    accountNumber: "GAS-456789123",
    location: "Main Warehouse",
    monthlyUsage: 80,
    unit: "m³",
    costPerUnit: 1.8,
    monthlyCost: 144,
    lastReading: "2024-01-15",
    status: "Active",
    dueDate: "2024-02-20",
    description: "Gas supply for heating and cooking",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "UTIL-004",
    type: "Internet",
    provider: "FPT Telecom",
    accountNumber: "INT-789123456",
    location: "Main Warehouse",
    monthlyUsage: 1000,
    unit: "GB",
    costPerUnit: 0.05,
    monthlyCost: 50,
    lastReading: "2024-01-15",
    status: "Active",
    dueDate: "2024-02-05",
    description: "High-speed internet connection",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "UTIL-005",
    type: "Electricity",
    provider: "Vietnam Electricity",
    accountNumber: "ELC-111222333",
    location: "North Branch",
    monthlyUsage: 1200,
    unit: "kWh",
    costPerUnit: 0.12,
    monthlyCost: 144,
    lastReading: "2024-01-15",
    status: "Overdue",
    dueDate: "2024-01-25",
    description: "North branch electricity supply",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "UTIL-006",
    type: "Phone",
    provider: "Viettel",
    accountNumber: "PHN-555666777",
    location: "Main Warehouse",
    monthlyUsage: 500,
    unit: "minutes",
    costPerUnit: 0.1,
    monthlyCost: 50,
    lastReading: "2024-01-15",
    status: "Active",
    dueDate: "2024-02-12",
    description: "Business phone line",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
]

export function useUtilities() {
  const [utilities, setUtilities] = useState<Utility[]>(mockUtilities)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<UtilityFilters>({})
  const [sortField, setSortField] = useState<UtilitySortField>("type")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredAndSortedUtilities = useMemo(() => {
    const filtered = utilities.filter((utility) => {
      const matchesSearch =
        utility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = !filters.type || utility.type === filters.type
      const matchesStatus = !filters.status || utility.status === filters.status
      const matchesLocation = !filters.location || utility.location === filters.location
      const matchesProvider = !filters.provider || utility.provider === filters.provider

      const matchesDueDateFrom = !filters.dueDateFrom || utility.dueDate >= filters.dueDateFrom
      const matchesDueDateTo = !filters.dueDateTo || utility.dueDate <= filters.dueDateTo

      const matchesCostFrom = filters.costFrom === undefined || utility.monthlyCost >= filters.costFrom
      const matchesCostTo = filters.costTo === undefined || utility.monthlyCost <= filters.costTo

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesLocation &&
        matchesProvider &&
        matchesDueDateFrom &&
        matchesDueDateTo &&
        matchesCostFrom &&
        matchesCostTo
      )
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "monthlyCost") {
        aValue = Number(aValue)
        bValue = Number(bValue)
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [utilities, searchTerm, filters, sortField, sortDirection])

  const paginatedUtilities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedUtilities.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedUtilities, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedUtilities.length / itemsPerPage)

  const addUtility = (utility: Omit<Utility, "id" | "createdAt" | "updatedAt">) => {
    const newUtility: Utility = {
      ...utility,
      id: `UTIL-${String(utilities.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setUtilities([...utilities, newUtility])
  }

  const updateUtility = (id: string, updates: Partial<Utility>) => {
    setUtilities(
      utilities.map((utility) =>
        utility.id === id ? { ...utility, ...updates, updatedAt: new Date().toISOString() } : utility,
      ),
    )
  }

  const deleteUtility = (id: string) => {
    setUtilities(utilities.filter((utility) => utility.id !== id))
  }

  const getUtilityById = (id: string) => {
    return utilities.find((utility) => utility.id === id)
  }

  const handleSort = (field: UtilitySortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const resetFilters = () => {
    setFilters({})
    setSearchTerm("")
    setCurrentPage(1)
  }

  const stats = useMemo(() => {
    const totalUtilities = utilities.length
    const activeUtilities = utilities.filter((u) => u.status === "Active").length
    const overdueUtilities = utilities.filter((u) => u.status === "Overdue").length
    const totalMonthlyCost = utilities.reduce((sum, u) => sum + u.monthlyCost, 0)
    const avgMonthlyCost = totalUtilities > 0 ? totalMonthlyCost / totalUtilities : 0

    return {
      totalUtilities,
      activeUtilities,
      overdueUtilities,
      totalMonthlyCost,
      avgMonthlyCost,
    }
  }, [utilities])

  return {
    utilities: paginatedUtilities,
    allUtilities: utilities,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems: filteredAndSortedUtilities.length,
    addUtility,
    updateUtility,
    deleteUtility,
    getUtilityById,
    resetFilters,
    stats,
  }
}
