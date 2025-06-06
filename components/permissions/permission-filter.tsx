"use client"

import { Search, Filter, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ROLE_LABELS } from "@/constants/nav"
import { useMemo, useState } from "react"
import { debounce } from "lodash"

interface PermissionFiltersProps {
  selectedRole: string
  onRoleChange: (role: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function PermissionFilters({ selectedRole, onRoleChange, searchQuery, onSearchChange }: PermissionFiltersProps) {
  const [query, setQuery] = useState(searchQuery)
  const debouncedSearch = useMemo(
    () => debounce((value: string) => onSearchChange(value), 500),
    [onSearchChange]
  )
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
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  debouncedSearch(e.target.value)
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
