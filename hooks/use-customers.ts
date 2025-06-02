"use client"

import { useState, useMemo } from "react"
import type { Customer, CustomerFilters } from "@/types/customer"

const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Solutions Inc.",
    location: "New York, USA",
    totalOrders: 15,
    totalSpent: "$3,250.00",
    lastOrder: "2024-01-15",
    status: "Active",
    customerType: "Premium",
    joinDate: "2023-06-15",
    notes: "Loyal customer, prefers premium products",
  },
  {
    id: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    company: "Design Studio LLC",
    location: "Los Angeles, USA",
    totalOrders: 8,
    totalSpent: "$1,890.00",
    lastOrder: "2024-01-12",
    status: "Active",
    customerType: "Regular",
    joinDate: "2023-08-22",
  },
  {
    id: "CUST-003",
    name: "Nguyen Van A",
    email: "nguyen.a@email.com",
    phone: "+84 123 456 789",
    company: "An Phat Trading",
    location: "Ho Chi Minh City, Vietnam",
    totalOrders: 22,
    totalSpent: "$5,670.00",
    lastOrder: "2024-01-14",
    status: "Active",
    customerType: "VIP",
    joinDate: "2023-03-10",
    notes: "VIP customer, bulk orders",
  },
  {
    id: "CUST-004",
    name: "Bob Johnson",
    email: "bob.johnson@email.com",
    phone: "+1 (555) 456-7890",
    company: "Manufacturing Corp",
    location: "Chicago, USA",
    totalOrders: 3,
    totalSpent: "$890.00",
    lastOrder: "2023-12-20",
    status: "Inactive",
    customerType: "Regular",
    joinDate: "2023-11-05",
  },
  {
    id: "CUST-005",
    name: "Alice Brown",
    email: "alice.brown@email.com",
    phone: "+1 (555) 321-0987",
    company: "Retail Solutions",
    location: "Miami, USA",
    totalOrders: 12,
    totalSpent: "$2,340.00",
    lastOrder: "2024-01-10",
    status: "Active",
    customerType: "Premium",
    joinDate: "2023-07-18",
  },
  {
    id: "CUST-006",
    name: "Tran Thi B",
    email: "tran.b@email.com",
    phone: "+84 987 654 321",
    company: "Fashion Boutique",
    location: "Hanoi, Vietnam",
    totalOrders: 18,
    totalSpent: "$4,120.00",
    lastOrder: "2024-01-13",
    status: "Active",
    customerType: "Premium",
    joinDate: "2023-04-25",
  },
]

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<CustomerFilters>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<keyof Customer>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = !filters.status || filters.status === "all" || customer.status === filters.status
      const matchesType =
        !filters.customerType || filters.customerType === "all" || customer.customerType === filters.customerType
      const matchesLocation =
        !filters.location || customer.location.toLowerCase().includes(filters.location.toLowerCase())

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

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customer,
      id: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
    }
    setCustomers([...customers, newCustomer])
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer)))
  }

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((customer) => customer.id !== id))
  }

  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id)
  }

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
  }
}
