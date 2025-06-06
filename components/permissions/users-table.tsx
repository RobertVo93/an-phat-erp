"use client"
import { useRouter } from "next/navigation"
import type React from "react"

import { UserRole } from "@/types"
import { type SortField } from "@/hooks/use-permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Loader2,
  Users,
  Shield,
  Settings,
  Calendar,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import { usePermissions } from "@/hooks/use-permissions"

interface UsersTableProps {
  selectedRole: string
  searchQuery: string
}

export function UsersTable({ selectedRole, searchQuery }: UsersTableProps) {
  const {
    users,
    totalPages,
    loading,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    handleSort,
    setCurrentPage,
    setPageSize,
    updateUserRole,
  } = usePermissions(selectedRole, searchQuery)

  const router = useRouter()

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.super_admin:
        return "bg-red-100 text-red-800 border-red-200"
      case UserRole.admin:
        return "bg-purple-100 text-purple-800 border-purple-200"
      case UserRole.manager:
        return "bg-blue-100 text-blue-800 border-blue-200"
      case UserRole.staff:
        return "bg-green-100 text-green-800 border-green-200"
      case UserRole.customer:
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="text-left p-4 font-medium cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field &&
          (sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
      </div>
    </th>
  )

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {/* Users Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "admin" || u.role === "super_admin").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Staff Members</p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "staff" || u.role === "manager").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <SortableHeader field="username">User</SortableHeader>
                  <SortableHeader field="role">Role</SortableHeader>
                  <SortableHeader field="createdAt">Created</SortableHeader>
                  <SortableHeader field="lastLogin">Last Login</SortableHeader>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">
                            {user.username
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserRole(user.id!, value as UserRole)}
                          disabled={user.role === "super_admin"}
                        >
                          <SelectTrigger className="h-8 text-xs w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Badge variant="outline" className={cn("text-xs", getRoleBadgeColor(user.role as UserRole))}>
                          {user.role?.replace("_", " ")}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(user.createdAt || "")}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/permissions/user/${user.id}`)}
                        disabled={user.role === "super_admin"}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage Permissions
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, users.length)}{" "}
                of {users.length} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
