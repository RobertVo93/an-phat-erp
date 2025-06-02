"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { CustomerFilters } from "@/types/customer"
import { useLanguage } from "@/contexts/language-context"


interface CustomerFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: CustomerFilters) => void
  currentFilters: CustomerFilters
}

export function CustomerFilterModal({ isOpen, onClose, onApply, currentFilters }: CustomerFilterModalProps) {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<CustomerFilters>(currentFilters)

  useEffect(() => {
    setFilters(currentFilters)
  }, [currentFilters, isOpen])

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: CustomerFilters = {}
    setFilters(resetFilters)
    onApply(resetFilters)
    onClose()
  }

  const updateFilter = (key: keyof CustomerFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("customers.filter.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("customers.filter.status")}</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("customers.filter.all")}</SelectItem>
                <SelectItem value="Active">{t("customers.status.active")}</SelectItem>
                <SelectItem value="Inactive">{t("customers.status.inactive")}</SelectItem>
                <SelectItem value="Pending">{t("customers.status.pending")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("customers.filter.customerType")}</Label>
            <Select
              value={filters.customerType || "all"}
              onValueChange={(value) => updateFilter("customerType", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("customers.filter.all")}</SelectItem>
                <SelectItem value="Regular">{t("customers.type.regular")}</SelectItem>
                <SelectItem value="Premium">{t("customers.type.premium")}</SelectItem>
                <SelectItem value="VIP">{t("customers.type.vip")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("customers.filter.location")}</Label>
            <Input
              placeholder="Enter location..."
              value={filters.location || ""}
              onChange={(e) => updateFilter("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("customers.filter.joinDateRange")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters.joinDateFrom || ""}
                onChange={(e) => updateFilter("joinDateFrom", e.target.value)}
              />
              <Input
                type="date"
                placeholder="To"
                value={filters.joinDateTo || ""}
                onChange={(e) => updateFilter("joinDateTo", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("customers.filter.orderCountRange")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min orders"
                value={filters.orderCountMin || ""}
                onChange={(e) =>
                  updateFilter("orderCountMin", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
              />
              <Input
                type="number"
                placeholder="Max orders"
                value={filters.orderCountMax || ""}
                onChange={(e) =>
                  updateFilter("orderCountMax", e.target.value ? Number.parseInt(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            {t("customers.filter.reset")}
          </Button>
          <Button onClick={handleApply}>{t("customers.filter.apply")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
