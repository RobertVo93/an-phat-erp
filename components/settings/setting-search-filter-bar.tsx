"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { Filter, Search } from "lucide-react"

interface SettingSearchFilterBarProps {
  searchTerm: string
  hasActiveFilters: boolean
  setSearchTerm: (value: string) => void
  onOpenFilter: () => void
  onReset: () => void
}

export function SettingSearchFilterBar({
  searchTerm,
  hasActiveFilters,
  setSearchTerm,
  onOpenFilter,
  onReset,
}: SettingSearchFilterBarProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("settings.searchPlaceholder")}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onOpenFilter}
          className={hasActiveFilters ? "border-blue-500 bg-blue-50" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          {t("settings.filter")}
          {hasActiveFilters && <span className="ml-1 text-xs bg-blue-500 text-white rounded-full px-1">!</span>}
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onReset}>
            {t("settings.resetFilters")}
          </Button>
        )}
      </div>
    </div>
  )
}
