"use client"

import { useState, useMemo, useEffect } from "react"
import type { Utility, UtilityFilters, UtilitySortField, SortDirection } from "@/types/utility"
import { UtilityStatus } from "@/types"
import { addUtility as apiAddUtility, getUtilities as apiGetUtilities, updateUtility as apiUpdateUtility, deleteUtility as apiDeleteUtility } from "@/lib/httpclient/utility.client"
import { debounce } from "lodash"

export function useUtilities() {
  const [utilities, setUtilities] = useState<Utility[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<UtilityFilters>({})
  const [sortField, setSortField] = useState<UtilitySortField>("type")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalUtilities, setTotalUtilities] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  const filteredAndSortedUtilities = useMemo(() => {
    const filtered = utilities.filter((utility) => {
      const matchesSearch =
        utility.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        utility.id?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = !filters.type || utility.type === filters.type
      const matchesStatus = !filters.status || utility.status === filters.status
      const matchesLocation = !filters.location || utility.location === filters.location
      const matchesProvider = !filters.provider || utility.provider === filters.provider

      const matchesDueDateFrom = !filters.dueDateFrom || utility.dueDate! >= filters.dueDateFrom
      const matchesDueDateTo = !filters.dueDateTo || utility.dueDate! <= filters.dueDateTo

      const matchesCostFrom = filters.costFrom === undefined || utility.monthlyCost! >= filters.costFrom
      const matchesCostTo = filters.costTo === undefined || utility.monthlyCost! <= filters.costTo

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

  const addUtility = async (utility: Omit<Utility, "id" | "createdAt" | "updatedAt">) => {
    try {
      setLoading(true)
      const newUtility: Utility = {
        ...utility,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const added = await apiAddUtility(newUtility)
      setUtilities([...utilities, added])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateUtility = async (id: string, updates: Partial<Utility>) => {
    try {
      setLoading(true)
      updates.updatedAt = new Date()
      const updated = await apiUpdateUtility(id, updates)
      setUtilities(utilities.map((ut) => (ut.id === id ? { ...ut, ...updated } : ut)))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteUtility = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteUtility(id)
      setUtilities(utilities.filter((utility) => utility.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
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
    const activeUtilities = utilities.filter((u) => u.status === UtilityStatus.active).length
    const overdueUtilities = utilities.filter((u) => u.status === UtilityStatus.overdue).length
    const totalMonthlyCost = utilities.reduce((sum, u) => sum + u.monthlyCost!, 0)
    const avgMonthlyCost = totalUtilities > 0 ? totalMonthlyCost / totalUtilities : 0

    return {
      totalUtilities,
      activeUtilities,
      overdueUtilities,
      totalMonthlyCost,
      avgMonthlyCost,
    }
  }, [utilities])

  useEffect(() => {
    const debouncedFetchUtility = debounce(async () => {
      setLoading(true)
      try {
        const res = await apiGetUtilities({
          page: currentPage,
          limit: itemsPerPage,
          sortField: sortField,
          sortDirection: sortDirection,
          searchTerm: searchTerm,
          type: filters.type,
          status: filters.status,
          location: filters.location,
          provider: filters.provider,
          dueDateFrom: filters.dueDateFrom,
          dueDateTo: filters.dueDateTo,
          costFrom: filters.costFrom,
          costTo: filters.costTo,
        })
        setUtilities(res.data)
        setTotalUtilities(res.total)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 1000)

    debouncedFetchUtility()

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchUtility.cancel()
    }
  }, [currentPage, itemsPerPage, filters, sortField, sortDirection, searchTerm])

  return {
    utilities: utilities,
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
    totalPages: Math.ceil(totalUtilities / itemsPerPage),
    // totalItems: filteredAndSortedUtilities.length,
    addUtility,
    updateUtility,
    deleteUtility,
    getUtilityById,
    resetFilters,
    stats,
    loading
  }
}
