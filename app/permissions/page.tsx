"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { UsersTable } from "@/components/permissions/users-table"
import { PermissionFilters } from "@/components/permissions/permission-filter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"

export default function PermissionsPage() {
  const { user } = useAuth()
  const [selectedRole, setSelectedRole] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">User Permissions Management</h1>
          <p className="text-gray-600">Manage user roles and access to ERP system pages</p>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> Click on a user to manage their specific page permissions.
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <PermissionFilters
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Users Table */}
      <UsersTable selectedRole={selectedRole} searchQuery={searchQuery} />
    </div>
  )
}
