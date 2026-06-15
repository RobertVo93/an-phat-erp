"use client"

import { useState, useMemo, useEffect } from "react"
import type { Product, ProductFormData, ProductFilters } from "@/types/product"
import { getProducts, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from "@/lib/httpclient/product.client"
import { debounce } from "lodash"
import { Collection } from "@/types/collection"
import { CollectionStatus } from "@/types/enums"
import { getCollections } from "@/lib/httpclient"
import { deleteProductImages, prepareProductImagesForSubmit } from "@/lib/product-image-upload"

export function useProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [allCollections, setAllCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ProductFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)

  const getAllCollections = async () => {
    setLoading(true)
    try {
      const response = await getCollections({ status: CollectionStatus.active, limit: 1000 })
      setAllCollections(response.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getAllCollections()
  }, [])

  useEffect(() => {
    const debouncedFetchProducts = debounce(async () => {
      setLoading(true)
      try {
        const res = await getProducts({
          collectionId: filters.collectionId || undefined,
          status: filters.status || undefined,
          priceRange: filters.priceRange,
          stockRange: filters.stockRange,
          limit: itemsPerPage,
          page: currentPage,
          sortBy: filters.sortBy || "name",
          sortOrder: filters.sortOrder || "desc",
          search: searchTerm,
        })
        setAllProducts(res.data);
        setTotalProducts(res.total)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }, 1000)

    debouncedFetchProducts()

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchProducts.cancel()
    }
  }, [currentPage, itemsPerPage, filters, searchTerm])

  const createProduct = async (data: ProductFormData): Promise<void> => {
    setLoading(true)
    try {
      const newProduct: Product = {
        ...data,
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      }
      const preparedProduct = await prepareProductImagesForSubmit(newProduct)
      const created = await apiCreateProduct(preparedProduct)
      setAllProducts((prev) => [...prev, created])
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, data: ProductFormData): Promise<void> => {
    setLoading(true)
    try {
      const selectedProduct = allProducts.find((pro) => pro.id === id)
      const preparedData = await prepareProductImagesForSubmit(data, selectedProduct)
      
      const updatedProduct: Product = {
        ...preparedData,
        updatedAt: new Date().toISOString() as any,
      }
      const updated = await apiUpdateProduct(id, updatedProduct)
      setAllProducts(allProducts.map((pro) => (pro.id === id ? { ...pro, ...updated } : pro)))
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    setLoading(true)
    try {
      await apiDeleteProduct(id)
      const selectedProduct = allProducts.find((prod) => prod.id === id)
      await deleteProductImages(selectedProduct)
      setAllProducts(allProducts.filter((pro) => pro.id !== id))
    } finally {
      setLoading(false)
    }
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setFormModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setFormModalOpen(true)
  }

  const handleFormSubmit = async (data: ProductFormData) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id!, data)
    } else {
      await createProduct(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id!)
    }
  }

  const hasActiveFilters = useMemo(() => Object.keys(filters).length > 0, [filters])
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage + 1, [currentPage, itemsPerPage])
  const endIndex = useMemo(() => Math.min(currentPage * itemsPerPage, totalProducts), [currentPage, itemsPerPage, totalProducts])
  const totalPages = useMemo(() => Math.ceil(totalProducts / itemsPerPage), [totalProducts, itemsPerPage])

  return {
    products: allProducts,
    loading,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalProducts,
    allCollections,
    hasActiveFilters,
    startIndex,
    endIndex,
    selectedProduct,
    viewModalOpen,
    formModalOpen,
    deleteModalOpen,
    filterModalOpen,

    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    handleCreate,
    handleView,
    handleEdit,
    handleDelete,
    handleFormSubmit,
    setFilterModalOpen,
    setViewModalOpen,
    setFormModalOpen,
    setDeleteModalOpen,
    handleDeleteConfirm,
  }
}
