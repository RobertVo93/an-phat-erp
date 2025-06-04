"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import type { CollectionFilters } from "@/types/collection"
import { CollectionCategory, CollectionStatus } from "@/types/enums"
import { useState } from "react"

interface CollectionFilterModalProps {
  filters: CollectionFilters
  open: boolean
  onOpenChange: (open: boolean) => void
  onFiltersChange: (filters: CollectionFilters) => void
  onReset: () => void
}

export function CollectionFilterModal({
  filters,
  open,
  onOpenChange,
  onFiltersChange,
  onReset,
}: CollectionFilterModalProps) {
  const [status, setStatus] = useState<string>(filters.status || "")
  const [category, setCategory] = useState<string>(filters.category || "")
  const { t } = useLanguage()

  const handleApply = () => {
    onOpenChange(false)
    onFiltersChange({ ...filters, status, category })
  }

  const handleReset = () => {
    onReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("collections.filter_modal.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">{t("collections.form.status")}</Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("collections.form.allStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("collections.form.allStatus")}</SelectItem>
                <SelectItem value={CollectionStatus.active}>{t("collections.status.active")}</SelectItem>
                <SelectItem value={CollectionStatus.draft}>{t("collections.status.draft")}</SelectItem>
                <SelectItem value={CollectionStatus.archived}>{t("collections.status.archived")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh Mục</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("collections.form.allCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("collections.form.allCategories")}</SelectItem>
                <SelectItem value={CollectionCategory.fashion}>{t("collections.category.fashion")}</SelectItem>
                <SelectItem value={CollectionCategory.electronics}>{t("collections.category.electronics")}</SelectItem>
                <SelectItem value={CollectionCategory.home}>{t("collections.category.home")}</SelectItem>
                <SelectItem value={CollectionCategory.office}>{t("collections.category.office")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReset}>
            {t("common.reset")}
          </Button>
          <Button type="button" onClick={handleApply}>
            {t("common.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
