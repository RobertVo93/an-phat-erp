"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import type { CustomerSortBy } from "@/types/customer"
import { ArrowUpDown, Filter, Search } from "lucide-react"

interface ICustomerListFilterBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onShowFilter: () => void
  sortBy: CustomerSortBy
  sortOrder: "asc" | "desc"
  onSort: (field: CustomerSortBy) => void
}

export function CustomerListFilterBar({
  searchTerm,
  onSearchTermChange,
  onShowFilter,
  sortBy,
  sortOrder,
  onSort,
}: ICustomerListFilterBarProps) {
  const { t } = useLanguage()
  const directionMarker = (field: CustomerSortBy) => sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : ""

  return (
    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("customers.searchPlaceholder")}
          className="pl-10"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
      </div>

      <div className="flex flex-row space-x-2">
        <Button variant="outline" onClick={onShowFilter} className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          <span className="md:hidden">{t("customers.filter")}</span>
          <span className="hidden md:inline">{t("customers.filter")}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {t("customers.sort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("createdAt")}>
              {t("customers.sort.createdAt")} {directionMarker("createdAt")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("joinDate")}>
              {t("customers.sort.joinDate")} {directionMarker("joinDate")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("name")}>
              {t("customers.sort.name")} {directionMarker("name")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("lastOrder")}>
              {t("customers.sort.lastOrder")} {directionMarker("lastOrder")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
