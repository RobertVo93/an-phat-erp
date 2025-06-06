"use client"

import { useState } from "react"
import { PAGE_PERMISSION_CATEGORIES } from "@/types/user-permission"
import { type IUser } from "@/types/user"
import { useUserPermissions } from "@/hooks/use-user-permissions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Save, Shield, Users, ChevronDown, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PermissionTableProps {
  selectedRole: string
  searchQuery: string
}

export function PermissionTable({ selectedRole, searchQuery }: PermissionTableProps) {
  const {
    users,
    loading,
    saving,
    updateUserPagePermission,
    getUserPagePermission,
    savePermissions,
    updateUserRole,
    toggleAllCategoryPermissions,
    getUserCategoryPermissionCount,
  } = useUserPermissions()

  const [expandedCategories, setExpandedCategories] = useState<string[]>(["monitoring"])

  const filteredUsers = users.filter((user) => {
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesSearch =
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const getRoleBadgeColor = (role: IUser["role"]) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "staff":
        return "bg-green-100 text-green-800 border-green-200"
      case "customer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading page permissions...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Users Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{filteredUsers.length}</p>
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
                  {filteredUsers.filter((u) => u.role === "admin" || u.role === "super_admin").length}
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
                  {filteredUsers.filter((u) => u.role === "staff" || u.role === "manager").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Access Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Page Access Permissions</CardTitle>
          <p className="text-sm text-gray-600">Control which pages each user can access in the ERP system</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium min-w-[250px] sticky left-0 bg-white z-10">User</th>
                  {PAGE_PERMISSION_CATEGORIES.map((category) => (
                    <th key={category.id} className="text-center p-2 font-medium min-w-[150px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                        className="font-medium flex items-center gap-1"
                      >
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        {category.title}
                        <span className="ml-1 text-xs">({category.children.length})</span>
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 sticky left-0 bg-white z-10 border-r">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">
                            {user.username
                              ?.split(" ")
                              ?.map((n: string) => n[0])
                              ?.join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm">{user.username}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Select
                              value={user.role}
                              onValueChange={(value) => updateUserRole(user.id!, value as IUser["role"])}
                              disabled={user.role === "super_admin"}
                            >
                              <SelectTrigger className="h-7 text-xs w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                            <Badge variant="outline" className={cn("text-xs", getRoleBadgeColor(user.role))}>
                              {user.role?.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </td>
                    {PAGE_PERMISSION_CATEGORIES.map((category) => {
                      const { granted, total } = getUserCategoryPermissionCount(user.id!, category.id)
                      const allGranted = granted === total
                      const someGranted = granted > 0 && granted < total

                      return (
                        <td key={category.id} className="p-3 text-center">
                          <div className="space-y-2">
                            {/* Category Toggle */}
                            <div className="flex justify-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAllCategoryPermissions(user.id!, category.id, !allGranted)}
                                disabled={user.role === "super_admin"}
                                className="h-6 px-2"
                              >
                                {allGranted ? (
                                  <ToggleRight className="h-4 w-4 text-green-600" />
                                ) : someGranted ? (
                                  <ToggleLeft className="h-4 w-4 text-yellow-600" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>

                            {/* Permission Count Badge */}
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                allGranted
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : someGranted
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200",
                              )}
                            >
                              {granted}/{total}
                            </Badge>

                            {/* Expanded Page List */}
                            {expandedCategories.includes(category.id) && (
                              <div className="space-y-1 mt-2 border-t pt-2">
                                {category.children.map((page) => (
                                  <div key={page.id} className="flex items-center justify-between text-xs">
                                    <span className="truncate max-w-[80px]" title={page.label}>
                                      {page.label}
                                    </span>
                                    <Checkbox
                                      checked={getUserPagePermission(user.id!, page.id)}
                                      onCheckedChange={(checked) =>
                                        updateUserPagePermission(user.id!, page.id, !!checked)
                                      }
                                      disabled={user.role === "super_admin"}
                                      className="h-3 w-3"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button disabled={saving} size="lg" className="min-w-[150px]">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Page Permissions
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
