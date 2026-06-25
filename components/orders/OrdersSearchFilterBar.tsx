"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import type { OrderSortBy } from "@/types"
import { ArrowUpDown, Filter, Search } from "lucide-react"

interface IOrdersSearchFilterBarProps {
  searchTerm: string
  activeFiltersCount: number
  sortBy: OrderSortBy
  sortOrder: "asc" | "desc"
  onSearchTermChange: (value: string) => void
  onShowFilter: () => void
  onSort: (field: OrderSortBy) => void
}

export function OrdersSearchFilterBar({
  searchTerm,
  activeFiltersCount,
  sortBy,
  sortOrder,
  onSearchTermChange,
  onShowFilter,
  onSort,
}: IOrdersSearchFilterBarProps) {
  const { t } = useLanguage()
  const directionMarker = (field: OrderSortBy) => sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : ""

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative w-full flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={t("orders.searchPlaceholder")}
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Button variant="outline" onClick={onShowFilter} className="relative flex-1 sm:flex-none">
          <Filter className="mr-2 h-4 w-4" />
          {t("orders.filter")}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 rounded-full px-1 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {t("orders.sort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onSort("orderDate")}>
              {t("orders.orderDate")} {directionMarker("orderDate")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("deliveryDate")}>
              {t("orders.expectedDelivery")} {directionMarker("deliveryDate")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("customer")}>
              {t("orders.customer")} {directionMarker("customer")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("totalAmount")}>
              {t("orders.amount")} {directionMarker("totalAmount")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("number")}>
              {t("orders.number")} {directionMarker("number")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
