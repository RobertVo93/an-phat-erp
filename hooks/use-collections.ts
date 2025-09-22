"use client"

import { useState, useEffect, useMemo } from "react"
import type { Collection, CollectionFilters } from "@/types/collection"
import { getCollections, createCollection as apiCreateCollection, updateCollection as apiUpdateCollection, deleteCollection as apiDeleteCollection } from "@/lib/httpclient"
import debounce from "lodash/debounce"
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3"
import { base64ToFile } from "@/lib/utils"

export function useCollections() {
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [filters, setFilters] = useState<CollectionFilters>({
    page: 1,
    limit: 8,
    sortBy: "createdAt",
    sortOrder: "desc",
    name: "",
    status: "",
    search: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [totalCollections, setTotalCollections] = useState(0)
  const [loading, setLoading] = useState(false)
  // Modal states
  const [viewModal, setViewModal] = useState<{ open: boolean; collection: Collection | null }>({
    open: false,
    collection: null,
  })
  const [formModal, setFormModal] = useState<{ open: boolean; collection: Collection | null }>({
    open: false,
    collection: null,
  })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; collection: Collection | null }>({
    open: false,
    collection: null,
  })

  useEffect(() => {
    const debouncedFetchCollections = debounce(async () => {
      setLoading(true)
      try {
        let filterOptions: any = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: filters.sortBy || "createdAt",
          sortOrder: filters.sortOrder || "desc",
          name: filters.search || undefined,
          search: filters.search || undefined,
        }
        if (filters.status && filters.status !== "all") {
          filterOptions.status = filters.status
        }
        const res = await getCollections(filterOptions)
        setAllCollections(res.data)
        setTotalCollections(res.total)
      } catch (err: any) {
      } finally {
        setLoading(false)
      }
    }, 1000)

    debouncedFetchCollections()

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchCollections.cancel()
    }
  }, [currentPage, itemsPerPage, filters])

  const createCollection = async (newCollection: Partial<Collection>) => {
    try {
      setLoading(true)
      if (newCollection.image && newCollection.image.startsWith("data:")) {
        // Convert base64 to File
        const file = base64ToFile(newCollection.image, "collection-image.png");
        // Upload to S3
        const s3Url = await uploadFileToS3(file, "collections");
        // Replace image field with S3 URL
        newCollection.image = s3Url;
      }
      const created = await apiCreateCollection(newCollection)
      setAllCollections([created, ...allCollections])
      setTotalCollections((prev) => prev + 1)
    } catch (err: any) {
      console.error(err.message || "Failed to create collection")
    }
    finally {
      setLoading(false)
    }
  }

  const updateCollection = async (id: string, updatedCollection: Partial<Collection>) => {
    try {
      setLoading(true)
      const selectedCollection = allCollections.find((col) => col.id === id)
      if (selectedCollection?.image && selectedCollection?.image !== updatedCollection.image) {
        // Delete old image from S3
        await deleteFileFromS3(selectedCollection.image)
      }

      if (updatedCollection.image?.startsWith("data:")) {
        // Convert base64 to File
        const file = base64ToFile(updatedCollection.image, "collection-image.png");
        // Upload to S3
        const s3Url = await uploadFileToS3(file, "collections");
        // Replace image field with S3 URL
        updatedCollection.image = s3Url;
      }
      const updated = await apiUpdateCollection(id, updatedCollection)
      setAllCollections(allCollections.map((col) => (col.id === id ? { ...col, ...updated } : col)))
    } catch (err: any) {
      console.error(err.message || "Failed to update collection")
    }
    finally {
      setLoading(false)
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteCollection(id)
      // Delete image from S3
      const selectedCollection = allCollections.find((col) => col.id === id)
      if (selectedCollection?.image) {
        await deleteFileFromS3(selectedCollection.image)
      }
      setAllCollections(allCollections.filter((col) => col.id !== id))
      setTotalCollections((prev) => prev - 1)
    } catch (err: any) {
      console.error(err.message || "Failed to delete collection")
    }
    finally {
      setLoading(false)
    }
  }

  const getCollection = (id: string) => {
    return allCollections.find((col) => col.id === id)
  }



  const handleView = (collection: Collection) => {
    setViewModal({ open: true, collection })
  }

  const handleEdit = (collection: Collection) => {
    setFormModal({ open: true, collection })
  }

  const handleDelete = (collection: Collection) => {
    setDeleteModal({ open: true, collection })
  }

  const handleCreate = () => {
    setFormModal({ open: true, collection: null })
  }

  const handleSave = (collectionData: any) => {
    if (formModal.collection) {
      updateCollection(formModal.collection.id!, collectionData)
    } else {
      createCollection(collectionData)
    }
  }

  const handleConfirmDelete = () => {
    if (deleteModal.collection) {
      deleteCollection(deleteModal.collection.id!)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSort = (field: string): void => {
    if (filters.sortBy === field) {
      // setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      setFilters(prev => ({ ...prev, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" }))
    } else {
      setFilters(prev => ({ ...prev, sortBy: field, sortOrder: "desc" }))
    }
    setCurrentPage(1)
  };

  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage + 1, [currentPage, itemsPerPage])
  const endIndex = useMemo(() => Math.min(currentPage * itemsPerPage, totalCollections), [currentPage, itemsPerPage, totalCollections])
  const totalPages = useMemo(() => Math.ceil(totalCollections / itemsPerPage), [totalCollections, itemsPerPage])

  return {
    collections: allCollections,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCollections,
    loading,
    startIndex,
    endIndex,
    viewModal,
    deleteModal,
    formModal,

    handleView,
    handleEdit,
    handleDelete,
    getCollection,
    setItemsPerPage,
    setCurrentPage,
    setFilters,
    handleCreate,
    handleSave,
    handleConfirmDelete,
    setViewModal,
    setFormModal,
    setDeleteModal,
    handlePageChange,
    handleSort
  }
}
