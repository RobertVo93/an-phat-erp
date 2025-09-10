"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductFilters } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import { Collection } from "@/types/collection"

interface ProductFilterModalProps {
  filters: ProductFilters
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: ProductFilters) => void
  allCollections: Collection[]
}

export function ProductFilterModal({ filters, open, onOpenChange, onApplyFilters, allCollections }: ProductFilterModalProps) {
  const { t } = useLanguage()

  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters, open])

  const handleApply = () => {
    onApplyFilters(localFilters)
    onOpenChange(false)
  }

  const handleReset = () => {
    const resetFilters: ProductFilters = {}
    setLocalFilters(resetFilters)
    onApplyFilters(resetFilters)
    onOpenChange(false)
  }

  const statuses = [
    { value: "active", label: t("products.status.active") },
    { value: "inactive", label: t("products.status.inactive") },
    { value: "lowStock", label: t("products.status.lowStock") },
    { value: "outOfStock", label: t("products.status.outOfStock") },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("products.filterProducts")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Collection Filter */}
          <div className="space-y-2">
            <Label>{t("products.form.collections")}</Label>
            <Select
              value={localFilters.collectionId ?? "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  collectionId: value || undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("products.filter.allCollections")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.filter.allCollections")}</SelectItem>
                {allCollections && allCollections.map((col, index) => (
                  <SelectItem key={index} value={col.id!}>
                    {col.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>{t("products.form.status")}</Label>
            <Select
              value={localFilters.status || ""}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value || undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("products.filter.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.filter.allStatuses")}</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <Label>{t("products.filter.priceRange")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={t("products.filter.minPrice")}
                value={localFilters.priceRange?.min || ""}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value)
                  setLocalFilters((prev) => ({
                    ...prev,
                    priceRange: {
                      min: isNaN(value) ? 0 : value,
                      max: prev.priceRange?.max || 999999,
                    },
                  }))
                }}
              />
              <Input
                type="number"
                placeholder={t("products.filter.maxPrice")}
                value={localFilters.priceRange?.max || ""}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value)
                  setLocalFilters((prev) => ({
                    ...prev,
                    priceRange: {
                      min: prev.priceRange?.min || 0,
                      max: isNaN(value) ? 999999 : value,
                    },
                  }))
                }}
              />
            </div>
          </div>

          {/* Stock Range Filter */}
          <div className="space-y-2">
            <Label>{t("products.filter.stockRange")}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={t("products.filter.minStock")}
                value={localFilters.stockRange?.min || ""}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  setLocalFilters((prev) => ({
                    ...prev,
                    stockRange: {
                      min: isNaN(value) ? 0 : value,
                      max: prev.stockRange?.max || 999999,
                    },
                  }))
                }}
              />
              <Input
                type="number"
                placeholder={t("products.filter.maxStock")}
                value={localFilters.stockRange?.max || ""}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  setLocalFilters((prev) => ({
                    ...prev,
                    stockRange: {
                      min: prev.stockRange?.min || 0,
                      max: isNaN(value) ? 999999 : value,
                    },
                  }))
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReset}>
            {t("products.filter.reset")}
          </Button>
          <Button type="button" onClick={handleApply}>
            {t("products.filter.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
