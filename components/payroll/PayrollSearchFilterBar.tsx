import { Search, Filter, ArrowUpDown } from "lucide-react"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import type { PayrollFilters, PayrollSortableKey } from "@/types/payroll"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PayrollFilterModal } from "@/components/payroll/payroll-filter-modal"

interface PayrollSearchFilterBarProps {
  searchTerm: string
  filter: PayrollFilters
  setSearchTerm: (v: string) => void
  setFilter: (v: PayrollFilters) => void
  handleSort: (field: PayrollSortableKey) => void
}

export const PayrollSearchFilterBar: React.FC<PayrollSearchFilterBarProps> = ({
  searchTerm,
  filter,
  setSearchTerm,
  setFilter,
  handleSort,
}) => {
  const { t } = useLanguage()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("payroll.searchPlaceholder")}
          value={searchTerm || ""}
          onChange={(e) => { setSearchTerm(e.target.value) }}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
          <Filter className="mr-2 h-4 w-4" />
          {t("payroll.filter")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {t("stockIn.sort")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* <DropdownMenuItem onClick={() => handleSort("employee.name")}>{t("payroll.employee")} {filter.sortBy === "employee.name" && (filter.sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => handleSort("payPeriod")}>{t("payroll.payPeriod")} {filter.sortBy === "payPeriod" && (filter.sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("workingShifts")}>{t("payroll.workingShifts")} {filter.sortBy === "workingShifts" && (filter.sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("workingHours")}>{t("payroll.workingHours")} {filter.sortBy === "workingHours" && (filter.sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("totalSalary")}>{t("payroll.totalSalary")} {filter.sortBy === "totalSalary" && (filter.sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("status")}>{t("payroll.status")} {filter.sortBy === "status" && (filter.sortOrder === "asc" ? "↑" : "↓")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <PayrollFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilter}
        currentFilters={filter}
      />
    </div>
  )
}
