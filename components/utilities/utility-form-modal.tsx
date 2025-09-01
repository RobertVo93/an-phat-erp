"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import type { Utility } from "@/types/utility"
import { UtilityStatus, UtilityUnit } from "@/types"
import { MutationMode } from "@/types/base.interface"
import { MoneyInput } from "@/components/common/input"

const defaultUtility: Utility = {
  name: "",
  provider: "",
  location: "",
  unit: UtilityUnit.other,
  costPerUnit: 0,
  status: UtilityStatus.active,
  description: "",
}
interface UtilityFormModalProps {
  isOpen: boolean
  utility?: Utility
  mode: MutationMode
  onClose: () => void
  onSave: (utility: Omit<Utility, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, updates: Partial<Utility>) => void
}

export function UtilityFormModal({ isOpen, utility, mode, onClose, onSave, onUpdate }: UtilityFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Utility>(defaultUtility)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === "update" && utility) {
      setFormData(utility)
    } else {
      setFormData(defaultUtility)
    }
    setErrors({})
  }, [mode, utility, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name!.trim()) {
      newErrors.name = t("utilities.nameRequired")
    }
    if (!formData.unit!) {
      newErrors.unit = t("utilities.unitRequired")
    }
    if (!formData.costPerUnit!) {
      newErrors.costPerUnit = t("utilities.costPerUnitRequired")
    }
    if (!formData.status) {
      newErrors.status = t("utilities.statusRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const utilityData = {
      name: formData.name,
      provider: formData.provider,
      location: formData.location,
      unit: formData.unit,
      costPerUnit: formData.costPerUnit,
      status: formData.status,
      description: formData.description,
    }

    if (mode === "update" && utility && onUpdate) {
      onUpdate(utility.id!, utilityData)
    } else {
      onSave(utilityData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "update" ? t("utilities.editUtility") : t("utilities.addUtility")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utilityName">{t("utilities.utilityName")} *</Label>
              <Input
                id="utilityName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("utilities.utilityName")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("utilities.status")} *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(UtilityStatus)
                    .map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`utilities.${status}`)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">{t("utilities.provider")}</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder={t("utilities.provider")}
              />
              {errors.provider && <p className="text-sm text-red-500">{errors.provider}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("utilities.location")}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t("utilities.location")}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">{t("utilities.unit")} *</Label>
              <Select value={formData.unit} onValueChange={(value: UtilityUnit) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.select")} ${t("utilities.unit").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(UtilityUnit)
                    .map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {t(`utilities.${unit}`)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPerUnit">{t("utilities.costPerUnit")} *</Label>
              <MoneyInput
                id="costPerUnit"
                value={formData.costPerUnit}
                onChange={(value) => setFormData({ ...formData, costPerUnit: value })}
                placeholder="0.00"
              />
              {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("utilities.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("utilities.description")}
              rows={3}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              {t("utilities.cancel")}
            </Button>
            <Button type="submit" className="flex-1 sm:flex-none">
              {t("utilities.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
