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
  const [sortBy, setSortBy] = useState<keyof Product>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      // Collection filter
      const matchesCollection =
        !filters.collectionId ||
        filters.collectionId === "all" ||
        (product.collections && product.collections.find(col => col.id === filters.collectionId));

      // Status filter
      const matchesStatus = !filters.status || filters.status === "all" || product.status === filters.status;

      // Price range filter
      const matchesPrice =
        !filters.priceRange || (product.price! >= filters.priceRange.min && product.price! <= filters.priceRange.max)

      // Stock range filter
      const matchesStock =
        !filters.stockRange || (product.stock! >= filters.stockRange.min && product.stock! <= filters.stockRange.max)

      return matchesSearch && matchesCollection && matchesStatus && matchesPrice && matchesStock
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
        return aValue! < bValue! ? -1 : aValue! > bValue! ? 1 : 0
      } else {
        return aValue! > bValue! ? -1 : aValue! < bValue! ? 1 : 0
      }
    })

    return filtered
  }, [allProducts, searchTerm, filters, sortBy, sortOrder])

  const getAllCollections = async () => {
    try {
      const response = await fetch("/api/collections");
      const data = await response.json();
      setAllCollections(data.data)
    } catch (e) {
      console.error(e)
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
        })
        setAllProducts(res.data);
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
  }, [currentPage, itemsPerPage, sortBy, sortOrder, filters])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const createProduct = async (data: ProductFormData): Promise<void> => {
    setLoading(true)
    try {
      const newProduct: Product = {
        id: `PRD-${String(allProducts.length + 1).padStart(3, "0")}`,
        ...data,
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      }
      console.log("newProduct", newProduct)
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
        id: `PRD-${String(allProducts.length + 1).padStart(3, "0")}`,
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
    allCollections,
    getAllCollections,
  }
}
