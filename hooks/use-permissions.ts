"use client"

import { useState, useEffect } from "react"
import {
  UserRole,
  type IUser,
} from "@/types"
import { getUsers, updateUser } from "@/lib/httpclient"

export type SortField = "username" | "email" | "role" | "createdAt" | "lastLogin"
export type SortDirection = "asc" | "desc"

export function usePermissions(selectedRole: string, searchQuery: string) {
  const [totalPages, setTotalPages] = useState(0)
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("username")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const getAllUsers = async (filterRole: string | null, filterSearch: string, sortField: SortField, sortDirection: SortDirection) => {
    try {
      setLoading(true)
      if (filterRole === "all") {
        filterRole = null
      }
      const response = await getUsers(1, 10, sortField, sortDirection, { role: filterRole as string, search: filterSearch })
      setUsers(response.data || [])
      setTotalPages(response.pagination?.totalPages || 0)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1) // Reset to first page when sorting
  }

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    await updateUser(userId, { role: newRole })
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  useEffect(() => {
    getAllUsers(selectedRole, searchQuery, sortField, sortDirection)
  }, [selectedRole, searchQuery, sortField, sortDirection])

  return {
    users: users,
    totalPages: totalPages,
    loading: loading,
    currentPage: currentPage,
    pageSize: pageSize,
    sortField: sortField,
    sortDirection: sortDirection,
    handleSort: handleSort,
    setCurrentPage: setCurrentPage,
    setPageSize: setPageSize,
    updateUserRole: updateUserRole,
  }
}
