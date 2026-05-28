import { Input } from "@/components/ui/input"
import { RangePickerCalendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Search } from "lucide-react"
import type { IUtilityUsageFilters } from "@/types"
import { UtilityUsageStatus } from "@/types/enums"

interface UtilityUsageSearchFilterBarProps {
  searchTerm: string
  onSearch: (value: string) => void
  filters: IUtilityUsageFilters
  onChangeFilters: (filters: IUtilityUsageFilters) => void
}

export function UtilityUsageSearchFilterBar({
  searchTerm,
  onSearch,
  filters,
  onChangeFilters,
}: UtilityUsageSearchFilterBarProps) {
  const { t } = useLanguage()

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
            placeholder={t("utilityUsage.searchPlaceholder")}
          />
        </div>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onChangeFilters({ ...filters, status: value === "all" ? undefined : value, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("utilityUsage.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {Object.values(UtilityUsageStatus).map((status) => (
              <SelectItem key={status} value={status}>{t(`utilityUsage.status.${status}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="md:col-span-2">
          <RangePickerCalendar
            startDate={filters.periodStart}
            endDate={filters.periodEnd}
            mode="day"
            onDateRangeChange={(range) =>
              onChangeFilters({
                ...filters,
                periodStart: range?.from,
                periodEnd: range?.to,
                page: 1,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
