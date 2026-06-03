"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { SettingConfigType, SettingFilters, SettingKey } from "@/types/setting.interface"
import { settingConfigTypes, settingKeysByConfigType } from "./setting.constants"
import { getSettingTypeLabel } from "./setting-type-label"

interface SettingFilterModalProps {
  isOpen: boolean
  currentFilters: SettingFilters
  onClose: () => void
  onApplyFilters: (filters: SettingFilters) => void
}

export function SettingFilterModal({
  isOpen,
  currentFilters,
  onClose,
  onApplyFilters,
}: SettingFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<SettingFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApplyFilters({ ...filters, page: 1 })
    onClose()
  }

  const handleReset = () => {
    const emptyFilters: SettingFilters = {
      page: 1,
      limit: currentFilters.limit || 10,
      sortBy: currentFilters.sortBy || "createdAt",
      sortOrder: currentFilters.sortOrder || "desc",
    }
    setFilters(emptyFilters)
    onApplyFilters(emptyFilters)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("settings.filter")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label>{t("settings.configType")}</Label>
          <Select
            value={filters.configType || "all"}
            onValueChange={(value) => setFilters({
              ...filters,
              configType: value === "all" ? undefined : (value as SettingConfigType),
              key: undefined,
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder={`${t("common.all")} ${t("settings.configType").toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {settingConfigTypes.map((configType) => (
                <SelectItem key={configType} value={configType}>
                  {getSettingTypeLabel(configType, t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("settings.key")}</Label>
          <Select
            value={filters.key || "all"}
            onValueChange={(value) => setFilters({ ...filters, key: value === "all" ? undefined : (value as SettingKey) })}
          >
            <SelectTrigger>
              <SelectValue placeholder={`${t("common.all")} ${t("settings.key").toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {getFilterKeys(filters.configType).map((key) => (
                <SelectItem key={key} value={key}>
                  {getSettingTypeLabel(key, t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleReset} className="flex-1 sm:flex-none">
            {t("settings.resetFilters")}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            {t("settings.cancel")}
          </Button>
          <Button onClick={handleApply} className="flex-1 sm:flex-none">
            {t("common.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function getFilterKeys(configType?: string) {
  if (configType) return settingKeysByConfigType[configType] || settingKeysByConfigType.other
  return Array.from(new Set(Object.values(settingKeysByConfigType).flat()))
}
