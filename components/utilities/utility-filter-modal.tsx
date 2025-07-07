"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { Utility, UtilityFilters } from "@/types/utility"
import { UtilityStatus, UtilityType } from "@/types"

interface UtilityFilterModalProps {
  utilities: Utility[]
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: UtilityFilters) => void
  currentFilters: UtilityFilters
}

export function UtilityFilterModal({ utilities, isOpen, onClose, onApplyFilters, currentFilters }: UtilityFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<UtilityFilters>(currentFilters)
  const [locations, setLocations] = useState<string[]>([])
  const [providers, setProviders] = useState<string[]>([])
  
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

  const onInit = async () => {
    try {
      utilities.forEach((ult: Utility) => {
        setLocations(prev => prev.includes(ult.location!) ? prev : [...prev, ult.location!])
        setProviders(prev => prev.includes(ult.provider!) ? prev : [...prev, ult.provider!])
      });
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    onInit()
  }, [utilities])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("utilities.filter")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("utilities.type")}</Label>
              <Select
                value={filters.type || "all"}
                onValueChange={(value) => setFilters({ ...filters, type: value === "all" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.all")} ${t("utilities.type").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {Object.keys(UtilityType)
                    .map((type) => (
                      <SelectItem key={Math.random()} value={type}>
                        {t(`utilities.${type}`)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2">
              <Label>{t("utilities.location")}</Label>
              <Select
                value={filters.location || "all"}
                onValueChange={(value) => setFilters({ ...filters, location: value === "all" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.all")} ${t("utilities.location").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("utilities.provider")}</Label>
              <Select
                value={filters.provider || "all"}
                onValueChange={(value) => setFilters({ ...filters, provider: value === "all" ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.all")} ${t("utilities.provider").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Monthly Cost Range</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Min Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.costFrom || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, costFrom: e.target.value ? Number.parseFloat(e.target.value) : undefined })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Max Cost ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.costTo || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, costTo: e.target.value ? Number.parseFloat(e.target.value) : undefined })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
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
