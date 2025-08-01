"use client"

import { useState, useMemo, useEffect } from "react"
import type { Customer, CustomerFilters } from "@/types/customer"
import { debounce } from "lodash"
import { createCustomer, getCustomers, updateCustomer as apiUpdateCustomer, deleteCustomer as apiDeleteCustomer } from "@/lib/httpclient/customer.client"
import { CustomerStatus, CustomerType } from "@/types/enums"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<CustomerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [totalCustomers, setTotalCustomers] = useState<number>(0)

  const reloadCustomers = async () => {
    setLoading(true)
    try {
      const res = await getCustomers({
        status: filters.status as CustomerStatus,
        customerType: filters.customerType as CustomerType,
        name: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: "createdAt",
        sortOrder: "desc",
      })

      // calcualte total spends of customers
      const calculatingCustomers = res.data.map((customer: Customer) => {
        const totalSpend = customer.orders?.reduce((sum, order) => sum + (order.totalAmount ?? 0), 0) ?? 0
        return {
          ...customer,
          totalSpend,
        }
      })
      setCustomers(calculatingCustomers)
      setTotalCustomers(res.total)

      const totalSpendAllCustomers = calculatingCustomers.reduce((sum: number, customer: Customer) => sum + customer.totalSpend!, 0)
      setTotalRevenue(totalSpendAllCustomers)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debouncedFetchProducts = debounce(async () => {
      setCurrentPage(1)
      reloadCustomers()
    }, 1000)

    debouncedFetchProducts()

    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFetchProducts.cancel()
    }
  }, [searchTerm])

  useEffect(() => {
    reloadCustomers()
  }, [currentPage, itemsPerPage, filters, ])

  const addCustomer = async (customer: Omit<Customer, "id">) => {
    try {
      setLoading(true)
      const newCustomer: Customer = {
        ...customer,
        customerType: customer.customerType as CustomerType,
        status: customer.status as CustomerStatus,
        createdAt: new Date().toISOString() as any,
        updatedAt: new Date().toISOString() as any,
      }
      const created = await createCustomer(newCustomer)
      setCustomers((prev) => [...prev, created])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      setLoading(true)
      const updatedCustomer: Customer = {
        ...updates,
        updatedAt: new Date().toISOString() as any,
      }
      const updated = await apiUpdateCustomer(id, updatedCustomer)
      setCustomers(customers.map((cus) => (cus.id === id ? { ...cus, ...updated } : cus)))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      setLoading(true)
      await apiDeleteCustomer(id)
      setCustomers(customers.filter((customer) => customer.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCustomer = () => {
    setFormMode("create")
    setSelectedCustomer(null)
    setIsFormModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setFormMode("edit")
    setSelectedCustomer(customer)
    setIsFormModalOpen(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewModalOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCustomer = (customerData: Omit<Customer, "id"> | Customer) => {
    if (formMode === "create") {
      addCustomer(customerData as Omit<Customer, "id">)
    } else if (formMode === "edit" && selectedCustomer) {
      updateCustomer(selectedCustomer.id!, customerData)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id!)
      setIsDeleteModalOpen(false)
      setSelectedCustomer(null)
    }
  }

  // Smart pagination for mobile
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const totalPages = useMemo(() => Math.ceil(totalCustomers / itemsPerPage), [totalCustomers, itemsPerPage])
  const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage + 1, [currentPage, itemsPerPage])
  const endIndex = useMemo(() => Math.min(currentPage * itemsPerPage, customers.length), [currentPage, itemsPerPage, customers])

  return {
    customers,
    allCustomers: customers,
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    totalPages,
    totalCustomers,
    loading,
    totalRevenue,
    startIndex,
    endIndex,
    selectedCustomer,
    formMode,
    isFilterModalOpen,
    isFormModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,

    setSearchTerm,
    setFilters,
    setCurrentPage,
    setItemsPerPage,
    getVisiblePages,
    handleCreateCustomer,
    handleViewCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
    setIsFilterModalOpen,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    handleSaveCustomer,
    handleConfirmDelete,
  }
}
