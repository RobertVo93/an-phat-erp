"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import type { Warehouse } from "@/types/warehouse"
import { WarehouseStatus } from "@/types"

interface WarehouseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (warehouse: Omit<Warehouse, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, updates: Partial<Warehouse>) => void
  warehouse?: Warehouse
  mode: "create" | "edit"
}

const defaultWarehouse: Warehouse = {
  name: "",
  address: "",
  manager: "",
  status: WarehouseStatus.active as const,
  phone: "",
  email: "",
  description: "",
  main: false,
}

export function WarehouseFormModal({ isOpen, onClose, onSave, onUpdate, warehouse, mode }: WarehouseFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Warehouse>(defaultWarehouse)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (warehouse && mode === "edit") {
      setFormData({
        name: warehouse.name!,
        address: warehouse.address!,
        manager: warehouse.manager!,
        status: warehouse.status,
        phone: warehouse.phone || "",
        email: warehouse.email || "",
        description: warehouse.description || "",
        main: warehouse.main || false,
      })
    } else {
      setFormData(defaultWarehouse)
    }
    setErrors({})
  }, [warehouse, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name!.trim()) {
      newErrors.name = t("warehouse.nameRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const warehouseData = {
      name: formData.name!.trim(),
      address: formData.address!.trim(),
      manager: formData.manager!.trim(),
      status: formData.status,
      phone: formData.phone!.trim(),
      email: formData.email!.trim(),
      description: formData.description!.trim(),
      main: formData.main || false,
    }

    if (mode === "edit" && warehouse && onUpdate) {
      onUpdate(warehouse.id!, warehouseData)
    } else {
      onSave(warehouseData)
    }
    onClose()
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? t("warehouse.editWarehouse") : t("warehouse.addWarehouse")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("warehouse.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                required
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("warehouse.address")}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manager">{t("warehouse.manager")}</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                className={errors.manager ? "border-red-500" : ""}
              />
              {errors.manager && <p className="text-sm text-red-500">{errors.manager}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t("warehouse.status")}</Label>
              <Select value={formData.status} onValueChange={(value: WarehouseStatus) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WarehouseStatus.active}>{t("warehouse.status.active")}</SelectItem>
                  <SelectItem value={WarehouseStatus.maintenance}>{t("warehouse.status.maintenance")}</SelectItem>
                  <SelectItem value={WarehouseStatus.inactive}>{t("warehouse.status.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("warehouse.phone")}</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("warehouse.email")}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("warehouse.input.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Main warehouse checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="main"
              type="checkbox"
              checked={!!formData.main}
              onChange={(e) => handleInputChange("main", e.target.checked)}
              className="h-4 w-4 cursor-pointer"
            />
            <Label htmlFor="main">{t("warehouse.mainWarehouse") || "Main warehouse"}</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("warehouse.cancel")}
            </Button>
            <Button type="submit">{t("warehouse.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
