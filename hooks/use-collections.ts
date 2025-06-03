"use client"

import { useState, useEffect } from "react"
import type { Collection, CollectionFilters } from "@/types/collection"
import { CollectionStatus, CollectionCategory } from "@/types/enums"
import { getCollections, createCollection as apiCreateCollection, updateCollection as apiUpdateCollection, deleteCollection as apiDeleteCollection } from "@/lib/httpclient"
import debounce from "lodash/debounce"

export function useCollections() {
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [filters, setFilters] = useState<CollectionFilters>({
    page: 1,
    limit: 8,
    sortBy: "name",
    sortOrder: "asc",
    name: "",
    status: "",
    category: "",
    search: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [sortBy, setSortBy] = useState<keyof Collection>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [totalCollections, setTotalCollections] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const debouncedFetchCollections = debounce(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getCollections({
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy as string,
          sortOrder,
          name: filters.search || undefined,
          status: filters.status || undefined,
          category: filters.category || undefined,
          search: filters.search || undefined,
        })
        setAllCollections(res.data)
        setTotalCollections(res.total)
      } catch (err: any) {
        setError(err.message || "Failed to load collections")
      } finally {
        setLoading(false)
      }
    }, 1000)

    debouncedFetchCollections()

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchCollections.cancel()
    }
  }, [currentPage, itemsPerPage, sortBy, sortOrder, filters])

  const createCollection = async (newCollection: Partial<Collection>) => {
    try {
      setLoading(true)
      const created = await apiCreateCollection(newCollection)
      setAllCollections([created, ...allCollections])
      setTotalCollections((prev) => prev + 1)
    } catch (err: any) {
      setError(err.message || "Failed to create collection")
    }
    finally {
      setLoading(false)
    }
  }

  const updateCollection = async (id: string, updatedCollection: Partial<Collection>) => {
    try {
      setLoading(true)
      const updated = await apiUpdateCollection(id, updatedCollection)
      setAllCollections(allCollections.map((col) => (col.id === id ? { ...col, ...updated } : col)))
    } catch (err: any) {
      setError(err.message || "Failed to update collection")
    }
    finally {
      setLoading(false)
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteCollection(id)
      setAllCollections(allCollections.filter((col) => col.id !== id))
      setTotalCollections((prev) => prev - 1)
    } catch (err: any) {
      setError(err.message || "Failed to delete collection")
    }
    finally {
      setLoading(false)
    }
  }

  const getCollection = (id: string) => {
    return allCollections.find((col) => col.id === id)
  }

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 8,
      sortBy: "name",
      sortOrder: "asc",
      name: "",
      status: "",
      category: "",
      search: "",
    })
  }

  return {
    collections: allCollections,
    allCollections,
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
    totalPages: Math.ceil(totalCollections / itemsPerPage),
    totalCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    getCollection,
    resetFilters,
    loading,
    error,
    CollectionStatus,
    CollectionCategory,
  }
}
