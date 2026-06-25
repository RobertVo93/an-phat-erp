"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import type { EmployeeSortBy } from "@/types/employee"
import { ArrowUpDown, Filter, Search } from "lucide-react"

interface IEmployeeFilterBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onShowFilter: () => void
  sortBy: EmployeeSortBy
  sortOrder: "asc" | "desc"
  onSort: (field: EmployeeSortBy) => void
}

export function EmployeeFilterBar({
  searchTerm,
  onSearchTermChange,
  onShowFilter,
  sortBy,
  sortOrder,
  onSort,
}: IEmployeeFilterBarProps) {
  const { t } = useLanguage()
  const marker = (field: EmployeeSortBy) => sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : ""

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t("employees.searchPlaceholder")}
          className="pl-10"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onShowFilter} className="flex-1 sm:flex-none">
          <Filter className="mr-2 h-4 w-4" />
          {t("employees.filter")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {t("employees.sort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("createdAt")}>
              {t("employees.sort.createdAt")} {marker("createdAt")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("name")}>
              {t("employees.form.name")} {marker("name")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("position")}>
              {t("employees.position")} {marker("position")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("department")}>
              {t("employees.department")} {marker("department")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("salary")}>
              {t("employees.salary")} {marker("salary")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("status")}>
              {t("employees.form.status")} {marker("status")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
