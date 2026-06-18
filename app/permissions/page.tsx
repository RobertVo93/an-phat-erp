"use client"

import { useState } from "react"
import { PermissionFilters } from "@/components/permissions/permission-filter"
import { UsersTable } from "@/components/permissions/users-table"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import { ADMIN_ROUTES } from "@/constants"

export default function PermissionsPage() {
  const { isSuperAdmin } = useAuth()
  const [selectedRole, setSelectedRole] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  if (!isSuperAdmin) {
    redirect(ADMIN_ROUTES.home())
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="mr-3 h-8 w-8" />
            User Permissions Management
          </h1>
          <p className="text-gray-600 mt-2">Manage user access to different pages and features</p>
        </div>
      </div>

      {/* Access Control Warning */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-amber-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Super Admin Access Required</h3>
              <p className="text-sm text-amber-700 mt-1">
                Only Super Administrators can access this page and modify user permissions. Changes affect user access
                to all system features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <PermissionFilters
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Users Table with Pagination and Sorting */}
      <UsersTable selectedRole={selectedRole} searchQuery={searchQuery} />
    </div>
  )
}
