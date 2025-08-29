import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { AttendanceFilters } from "@/types/attendance"

interface AttendanceSearchFilterBarProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  filters: AttendanceFilters
  itemsPerPage: number
  setItemsPerPage: (n: number) => void
  onOpenFilter: () => void
  onReset: () => void
}

export const AttendanceSearchFilterBar: React.FC<AttendanceSearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  itemsPerPage,
  setItemsPerPage,
  onOpenFilter,
  onReset,
}) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex w-full relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("attendance.searchPlaceholder")}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button variant="outline" onClick={onOpenFilter} className="flex-1 sm:flex-none">
          <Filter className="mr-2 h-4 w-4" />
          {t("attendance.filter")}
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className={`flex-1 sm:flex-none ${Object.keys(filters).length === 0 && 'bg-gray-400 pointer-events-none hover:bg-gray-400'}`}
        >
          {t("attendance.filter.reset")}
        </Button>
        <Select value={`${itemsPerPage}`} onValueChange={v => setItemsPerPage(Number.parseInt(v))}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
