import { Search, Filter, ArrowUpDown, Calendar, User, CreditCard, Hash } from "lucide-react"
import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { OrderSortBy } from "@/types"

interface OrdersSearchFilterBarProps {
    searchTerm: string
    activeFiltersCount: number
    pageSize: number
    setSearchTerm: (v: string) => void
    onFilterClick: () => void
    setPageSize: (v: number) => void
    onSort: (field: OrderSortBy) => void
}

export const OrdersSearchFilterBar: React.FC<OrdersSearchFilterBarProps> = ({
    searchTerm,
    activeFiltersCount,
    pageSize,
    setSearchTerm,
    onFilterClick,
    setPageSize,
    onSort,
}) => {
    const { t } = useLanguage()
    return (
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder={t("orders.searchPlaceholder")}
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex space-x-2 sm:space-x-4">
                <Button variant="outline" onClick={onFilterClick} className="relative flex-1 sm:flex-none">
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{t("orders.filter")}</span>
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>
                <Select value={pageSize.toString()} onValueChange={v => setPageSize(Number(v))}>
                    <SelectTrigger className="w-20 sm:w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="sm:hidden">
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSort("deliveryDate")}> <Calendar className="mr-2 h-4 w-4" /> {t("orders.expectedDelivery")} </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSort("customer")}> <User className="mr-2 h-4 w-4" /> {t("orders.customer")} </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSort("totalAmount")}> <CreditCard className="mr-2 h-4 w-4" /> {t("orders.amount")} </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSort("orderNumber")}> <Hash className="mr-2 h-4 w-4" /> {t("orders.orderNumber")} </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
