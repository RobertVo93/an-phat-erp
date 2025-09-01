import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { UtilitySortField } from "@/types/utility"

interface UtilitySortControlsProps {
  sortField: UtilitySortField
  sortDirection: "asc" | "desc"
  onChangeField: (field: UtilitySortField) => void
  onToggleDirection: () => void
}

export const UtilitySortControls: React.FC<UtilitySortControlsProps> = ({ sortField, sortDirection, onChangeField, onToggleDirection }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{t("utilities.sortBy")}:</span>
        <Select value={sortField} onValueChange={(value) => onChangeField(value as UtilitySortField)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">{t("common.number")}</SelectItem>
            <SelectItem value="name">{t("common.name")}</SelectItem>
            <SelectItem value="provider">{t("utilities.provider")}</SelectItem>
            <SelectItem value="location">{t("utilities.location")}</SelectItem>
            <SelectItem value="status">{t("utilities.status")}</SelectItem>
            <SelectItem value="costPerUnit">{t("utilities.costPerUnit")}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onToggleDirection}>
          <ArrowUpDown className="h-4 w-4" />
          {sortDirection === "asc" ? t("utilities.ascending") : t("utilities.descending")}
        </Button>
      </div>
    </div>
  )
}

