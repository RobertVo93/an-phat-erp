"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { UtilityFilters } from "@/types/utility"
import { UtilityStatus } from "@/types"
import { MoneyInput } from "@/components/common/input"

interface UtilityFilterModalProps {
  isOpen: boolean
  currentFilters: UtilityFilters
  onClose: () => void
  onApplyFilters: (filters: UtilityFilters) => void
}

export function UtilityFilterModal({ isOpen, currentFilters, onClose, onApplyFilters }: UtilityFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<UtilityFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleReset = () => {
    const emptyFilters: UtilityFilters = {}
    setFilters(emptyFilters)
    onApplyFilters(emptyFilters)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("utilities.filter")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("utilities.status")}</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.all")} ${t("utilities.status").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {Object.keys(UtilityStatus)
                    .map((status: any) => (
                      <SelectItem key={Math.random()} value={status}>
                        {t(`utilities.${status}`)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">{t("utilities.minCost")}</Label>
                <MoneyInput
                  placeholder="0"
                  value={filters.costFrom} 
                  onChange={(value) => setFilters((prev) => ({ ...prev, costFrom: value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">{t("utilities.maxCost")}</Label>
                <MoneyInput 
                  placeholder="0"
                  value={filters.costTo} 
                  onChange={(value) => setFilters((prev) => ({ ...prev, costTo: value }))} 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end sm:flex-row gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleReset} className="flex-1 sm:flex-none">
            {t("utilities.resetFilters")}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            {t("utilities.cancel")}
          </Button>
          <Button onClick={handleApply} className="flex-1 sm:flex-none">
            {t("common.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
