"use client"

import { useState, useMemo, useEffect } from "react"
import type { Product, ProductFormData, ProductFilters } from "@/types/product"
import { getProducts, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from "@/lib/httpclient/product.client"
import { debounce } from "lodash"
import { Collection } from "@/types/collection"
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3"
import { base64ToFile } from "@/lib/utils"

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
      const response = await fetch("/api/collections");
      const data = await response.json();
      setAllCollections(data.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

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
          sortBy: filters.sortBy || "createdAt",
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
      if (newProduct.image && newProduct.image.startsWith("data:")) {
        // Convert base64 to File
        const file = base64ToFile(newProduct.image, "product-image.png");
        // Upload to S3
        const s3Url = await uploadFileToS3(file, "products");
        // Replace image field with S3 URL
        newProduct.image = s3Url;
      }
      const created = await apiCreateProduct(newProduct)
      setAllProducts((prev) => [...prev, created])
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, data: ProductFormData): Promise<void> => {
    setLoading(true)
    try {
      const selectedProduct = allProducts.find((pro) => pro.id === id)
      if (selectedProduct?.image && selectedProduct?.image !== data.image) {
        // Delete old image from S3
        await deleteFileFromS3(selectedProduct.image)
      }

      if (data.image?.startsWith("data:")) {
        // Convert base64 to File
        const file = base64ToFile(data.image, "product-image.png");
        // Upload to S3
        const s3Url = await uploadFileToS3(file, "products");
        // Replace image field with S3 URL
        data.image = s3Url;
      }
      
      const updatedProduct: Product = {
        ...data,
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
      // Delete image from S3
      const selectedProduct = allProducts.find((prod) => prod.id === id)
      if (selectedProduct?.image) {
        await deleteFileFromS3(selectedProduct.image)
      }
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
    getAllCollections,
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
