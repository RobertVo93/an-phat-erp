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
  const [sortBy, setSortBy] = useState<keyof Customer>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [loading, setLoading] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name!.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email!.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone!.includes(searchTerm) ||
        customer.id!.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = !filters.status || filters.status === "all" || customer.status === filters.status.toLowerCase()
      const matchesType =
        !filters.customerType || filters.customerType === "all" || customer.customerType === filters.customerType.toLowerCase()
      const matchesLocation =
        !filters.location || customer.location!.toLowerCase().includes(filters.location.toLowerCase())

      return matchesSearch && matchesStatus && matchesType && matchesLocation
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (!aValue || !bValue) return 0

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [customers, searchTerm, filters, sortBy, sortOrder])

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedCustomers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage)

  const addCustomer = async (customer: Omit<Customer, "id">) => {
    try {
      setLoading(true)
      const newCustomer: Customer = {
        ...customer,
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
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
        id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
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

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id)
  }

  useEffect(() => {
    const debouncedFetchProducts = debounce(async () => {
      setLoading(true)
      try {
        const res = await getCustomers({
          status: filters.status as CustomerStatus,
          customerType: filters.customerType as CustomerType,
          name: filters.name,
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

        const totalSpendAllCustomers = calculatingCustomers.reduce((sum: number, customer: Customer) => sum + customer.totalSpend!, 0)
        setTotalRevenue(totalSpendAllCustomers)
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

  return {
    customers: paginatedCustomers,
    allCustomers: customers,
    filteredCustomers: filteredAndSortedCustomers,
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
    totalCustomers: filteredAndSortedCustomers.length,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    loading,
    totalRevenue,
  }
}
