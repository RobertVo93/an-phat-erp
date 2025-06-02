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

interface UtilityFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (utility: Omit<Utility, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, updates: Partial<Utility>) => void
  utility?: Utility
  mode: "create" | "edit"
}

export function UtilityFormModal({ isOpen, onClose, onSave, onUpdate, utility, mode }: UtilityFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    type: "",
    provider: "",
    accountNumber: "",
    location: "",
    monthlyUsage: "",
    unit: "",
    costPerUnit: "",
    monthlyCost: "",
    lastReading: "",
    status: "Active" as const,
    dueDate: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === "edit" && utility) {
      setFormData({
        type: utility.type,
        provider: utility.provider,
        accountNumber: utility.accountNumber,
        location: utility.location,
        monthlyUsage: utility.monthlyUsage.toString(),
        unit: utility.unit,
        costPerUnit: utility.costPerUnit.toString(),
        monthlyCost: utility.monthlyCost.toString(),
        lastReading: utility.lastReading,
        status: utility.status,
        dueDate: utility.dueDate,
        description: utility.description || "",
      })
    } else {
      setFormData({
        type: "",
        provider: "",
        accountNumber: "",
        location: "",
        monthlyUsage: "",
        unit: "",
        costPerUnit: "",
        monthlyCost: "",
        lastReading: "",
        status: "Active",
        dueDate: "",
        description: "",
      })
    }
    setErrors({})
  }, [mode, utility, isOpen])

  // Auto-calculate monthly cost when usage or cost per unit changes
  useEffect(() => {
    const usage = Number.parseFloat(formData.monthlyUsage) || 0
    const costPerUnit = Number.parseFloat(formData.costPerUnit) || 0
    const monthlyCost = usage * costPerUnit

    if (usage > 0 && costPerUnit > 0) {
      setFormData((prev) => ({
        ...prev,
        monthlyCost: monthlyCost.toFixed(2),
      }))
    }
  }, [formData.monthlyUsage, formData.costPerUnit])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.type.trim()) {
      newErrors.type = t("utilities.typeRequired")
    }
    if (!formData.provider.trim()) {
      newErrors.provider = t("utilities.providerRequired")
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = t("utilities.accountNumberRequired")
    }
    if (!formData.location.trim()) {
      newErrors.location = t("utilities.locationRequired")
    }
    if (!formData.monthlyUsage.trim()) {
      newErrors.monthlyUsage = t("utilities.monthlyUsageRequired")
    }
    if (!formData.unit.trim()) {
      newErrors.unit = t("utilities.unitRequired")
    }
    if (!formData.costPerUnit.trim()) {
      newErrors.costPerUnit = t("utilities.costPerUnitRequired")
    }
    if (!formData.status) {
      newErrors.status = t("utilities.statusRequired")
    }
    if (!formData.dueDate.trim()) {
      newErrors.dueDate = t("utilities.dueDateRequired")
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
      type: formData.type,
      provider: formData.provider,
      accountNumber: formData.accountNumber,
      location: formData.location,
      monthlyUsage: Number.parseFloat(formData.monthlyUsage),
      unit: formData.unit,
      costPerUnit: Number.parseFloat(formData.costPerUnit),
      monthlyCost: Number.parseFloat(formData.monthlyCost),
      lastReading: formData.lastReading,
      status: formData.status,
      dueDate: formData.dueDate,
      description: formData.description,
    }

    if (mode === "edit" && utility && onUpdate) {
      onUpdate(utility.id, utilityData)
    } else {
      onSave(utilityData)
    }

    onClose()
  }

  const utilityTypes = ["electricity", "water", "gas", "internet", "phone", "cable", "security", "cleaning"]

  const units = ["kwh", "m3", "gb", "minutes"]

  const statuses = ["active", "inactive", "overdue", "disconnected"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? t("utilities.editUtility") : t("utilities.addUtility")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t("utilities.type")} *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.select")} ${t("utilities.type").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {utilityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`utilities.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">{t("utilities.provider")} *</Label>
              <Input
                id="provider"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder={t("utilities.provider")}
              />
              {errors.provider && <p className="text-sm text-red-500">{errors.provider}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">{t("utilities.accountNumber")} *</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder={t("utilities.accountNumber")}
              />
              {errors.accountNumber && <p className="text-sm text-red-500">{errors.accountNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("utilities.location")} *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t("utilities.location")}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyUsage">{t("utilities.monthlyUsage")} *</Label>
              <Input
                id="monthlyUsage"
                type="number"
                step="0.01"
                value={formData.monthlyUsage}
                onChange={(e) => setFormData({ ...formData, monthlyUsage: e.target.value })}
                placeholder="0"
              />
              {errors.monthlyUsage && <p className="text-sm text-red-500">{errors.monthlyUsage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">{t("utilities.unit")} *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={`${t("common.select")} ${t("utilities.unit").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
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
              <Input
                id="costPerUnit"
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                placeholder="0.00"
              />
              {errors.costPerUnit && <p className="text-sm text-red-500">{errors.costPerUnit}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyCost">{t("utilities.monthlyCost")}</Label>
              <Input
                id="monthlyCost"
                type="number"
                step="0.01"
                value={formData.monthlyCost}
                onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                placeholder="0.00"
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastReading">{t("utilities.lastReading")}</Label>
              <Input
                id="lastReading"
                type="date"
                value={formData.lastReading}
                onChange={(e) => setFormData({ ...formData, lastReading: e.target.value })}
              />
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
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`utilities.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">{t("utilities.dueDate")} *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
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

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
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
