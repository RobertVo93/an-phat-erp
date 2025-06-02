"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useLanguage } from "@/contexts/language-context"
import type { WarehouseFilters } from "@/types/warehouse"

interface WarehouseFilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: WarehouseFilters
  onFiltersChange: (filters: WarehouseFilters) => void
}

export function WarehouseFilterModal({ isOpen, onClose, filters, onFiltersChange }: WarehouseFilterModalProps) {
  const { t } = useLanguage()
  const [localFilters, setLocalFilters] = useState<WarehouseFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters: WarehouseFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClose()
  }

  const handleUtilizationChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      utilizationRange: [value[0], value[1]],
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("warehouse.filterTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t("warehouse.status")}</Label>
            <Select
              value={localFilters.status || "AllStatuses"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value === "AllStatuses" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("warehouse.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AllStatuses">{t("warehouse.allStatuses")}</SelectItem>
                <SelectItem value="Active">{t("warehouse.status.Active")}</SelectItem>
                <SelectItem value="Maintenance">{t("warehouse.status.Maintenance")}</SelectItem>
                <SelectItem value="Inactive">{t("warehouse.status.Inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("warehouse.type")}</Label>
            <Select
              value={localFilters.type || "AllTypes"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  type: value === "AllTypes" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("warehouse.allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AllTypes">{t("warehouse.allTypes")}</SelectItem>
                <SelectItem value="Distribution Center">{t("warehouse.type.DistributionCenter")}</SelectItem>
                <SelectItem value="Regional Hub">{t("warehouse.type.RegionalHub")}</SelectItem>
                <SelectItem value="Cold Storage">{t("warehouse.type.ColdStorage")}</SelectItem>
                <SelectItem value="Backup Storage">{t("warehouse.type.BackupStorage")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("warehouse.temperature")}</Label>
            <Select
              value={localFilters.temperature || "AllTemperatures"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  temperature: value === "AllTemperatures" ? undefined : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("warehouse.allTemperatures")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AllTemperatures">{t("warehouse.allTemperatures")}</SelectItem>
                <SelectItem value="Ambient">{t("warehouse.temperature.Ambient")}</SelectItem>
                <SelectItem value="Refrigerated">{t("warehouse.temperature.Refrigerated")}</SelectItem>
                <SelectItem value="Frozen">{t("warehouse.temperature.Frozen")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>{t("warehouse.utilizationRange")}</Label>
            <div className="px-2">
              <Slider
                value={localFilters.utilizationRange || [0, 100]}
                onValueChange={handleUtilizationChange}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>{localFilters.utilizationRange?.[0] || 0}%</span>
                <span>{localFilters.utilizationRange?.[1] || 100}%</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleClearFilters} className="flex-1">
              {t("warehouse.clearFilters")}
            </Button>
            <Button onClick={handleApplyFilters} className="flex-1">
              {t("warehouse.applyFilters")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
