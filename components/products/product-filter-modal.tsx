"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductFilters } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"

interface ProductFilterModalProps {
  filters: ProductFilters
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: ProductFilters) => void
}

export function ProductFilterModal({ filters, open, onOpenChange, onApplyFilters }: ProductFilterModalProps) {
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

  const categories = [
    { value: "electronics", label: t("products.category.electronics") },
    { value: "furniture", label: t("products.category.furniture") },
    { value: "accessories", label: t("products.category.accessories") },
    { value: "appliances", label: t("products.category.appliances") },
    { value: "clothing", label: t("products.category.clothing") },
    { value: "books", label: t("products.category.books") },
    { value: "sports", label: t("products.category.sports") },
    { value: "toys", label: t("products.category.toys") },
  ]

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
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>{t("products.form.category")}</Label>
            <Select
              value={localFilters.category || ""}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  category: value || undefined,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("products.filter.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.filter.allCategories")}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
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
