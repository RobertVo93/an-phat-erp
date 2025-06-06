"use client"

import { Search, Filter, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ROLE_LABELS } from "@/types/user-permission"

interface PermissionFiltersProps {
  selectedRole: string
  onRoleChange: (role: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function PermissionFilters({ selectedRole, onRoleChange, searchQuery, onSearchChange }: PermissionFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Select value={selectedRole} onValueChange={onRoleChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedRole !== "all" || searchQuery) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {selectedRole !== "all" && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Role: {ROLE_LABELS[selectedRole as keyof typeof ROLE_LABELS]}
                </span>
              )}
              {searchQuery && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Search: "{searchQuery}"</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
