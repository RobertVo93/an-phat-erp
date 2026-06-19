"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import type { ProductionSortBy } from "@/types/production"
import { ArrowUpDown, Filter, Search } from "lucide-react"

interface IProductionHistoryFilterBarProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  onShowFilter: () => void
  sortBy: ProductionSortBy
  sortOrder: "asc" | "desc"
  onSort: (field: ProductionSortBy) => void
}

export function ProductionHistoryFilterBar({
  searchTerm,
  onSearchTermChange,
  onShowFilter,
  sortBy,
  sortOrder,
  onSort,
}: IProductionHistoryFilterBarProps) {
  const { t } = useLanguage()
  const directionMarker = (field: ProductionSortBy) => sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : ""

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t("production.history.searchPlaceholder")}
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Button variant="outline" onClick={onShowFilter} className="flex-1 sm:flex-none">
          <Filter className="mr-2 h-4 w-4" />
          {t("production.history.filter")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {t("production.history.sort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("date")}>
              {t("production.history.sort.date")} {directionMarker("date")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("number")}>
              {t("production.history.sort.number")} {directionMarker("number")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("status")}>
              {t("production.history.status")} {directionMarker("status")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
