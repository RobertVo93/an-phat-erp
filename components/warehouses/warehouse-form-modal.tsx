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

interface WarehouseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (warehouse: Omit<Warehouse, "id" | "createdAt" | "updatedAt">) => void
  onUpdate?: (id: string, updates: Partial<Warehouse>) => void
  warehouse?: Warehouse
  mode: "create" | "edit"
}

export function WarehouseFormModal({ isOpen, onClose, onSave, onUpdate, warehouse, mode }: WarehouseFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    manager: "",
    capacity: "",
    occupied: "",
    status: "Active" as const,
    type: "Distribution Center" as const,
    zones: "",
    temperature: "Ambient" as const,
    phone: "",
    email: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (warehouse && mode === "edit") {
      setFormData({
        name: warehouse.name,
        location: warehouse.location,
        address: warehouse.address,
        manager: warehouse.manager,
        capacity: warehouse.capacity.toString(),
        occupied: warehouse.occupied.toString(),
        status: warehouse.status,
        type: warehouse.type,
        zones: warehouse.zones.toString(),
        temperature: warehouse.temperature,
        phone: warehouse.phone || "",
        email: warehouse.email || "",
        description: warehouse.description || "",
      })
    } else {
      setFormData({
        name: "",
        location: "",
        address: "",
        manager: "",
        capacity: "",
        occupied: "",
        status: "Active",
        type: "Distribution Center",
        zones: "",
        temperature: "Ambient",
        phone: "",
        email: "",
        description: "",
      })
    }
    setErrors({})
  }, [warehouse, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t("warehouse.nameRequired")
    }
    if (!formData.location.trim()) {
      newErrors.location = t("warehouse.locationRequired")
    }
    if (!formData.address.trim()) {
      newErrors.address = t("warehouse.addressRequired")
    }
    if (!formData.manager.trim()) {
      newErrors.manager = t("warehouse.managerRequired")
    }
    if (!formData.capacity.trim()) {
      newErrors.capacity = t("warehouse.capacityRequired")
    } else if (Number(formData.capacity) <= 0) {
      newErrors.capacity = t("warehouse.capacityPositive")
    }
    if (!formData.occupied.trim()) {
      newErrors.occupied = t("warehouse.occupiedRequired")
    } else if (Number(formData.occupied) < 0) {
      newErrors.occupied = t("warehouse.occupiedPositive")
    } else if (Number(formData.occupied) > Number(formData.capacity)) {
      newErrors.occupied = t("warehouse.occupiedLessCapacity")
    }
    if (!formData.zones.trim()) {
      newErrors.zones = t("warehouse.zonesRequired")
    } else if (Number(formData.zones) <= 0) {
      newErrors.zones = t("warehouse.zonesPositive")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const warehouseData = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      address: formData.address.trim(),
      manager: formData.manager.trim(),
      capacity: Number(formData.capacity),
      occupied: Number(formData.occupied),
      status: formData.status,
      type: formData.type,
      zones: Number(formData.zones),
      temperature: formData.temperature,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      description: formData.description.trim(),
    }

    if (mode === "edit" && warehouse && onUpdate) {
      onUpdate(warehouse.id, warehouseData)
    } else {
      onSave(warehouseData)
    }
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("warehouse.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t("warehouse.location")} *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("warehouse.address")} *</Label>
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
              <Label htmlFor="manager">{t("warehouse.manager")} *</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => handleInputChange("manager", e.target.value)}
                className={errors.manager ? "border-red-500" : ""}
              />
              {errors.manager && <p className="text-sm text-red-500">{errors.manager}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zones">{t("warehouse.zones")} *</Label>
              <Input
                id="zones"
                type="number"
                value={formData.zones}
                onChange={(e) => handleInputChange("zones", e.target.value)}
                className={errors.zones ? "border-red-500" : ""}
              />
              {errors.zones && <p className="text-sm text-red-500">{errors.zones}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">{t("warehouse.capacity")} (m²) *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                className={errors.capacity ? "border-red-500" : ""}
              />
              {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupied">{t("warehouse.occupied")} (m²) *</Label>
              <Input
                id="occupied"
                type="number"
                value={formData.occupied}
                onChange={(e) => handleInputChange("occupied", e.target.value)}
                className={errors.occupied ? "border-red-500" : ""}
              />
              {errors.occupied && <p className="text-sm text-red-500">{errors.occupied}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t("warehouse.status")}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">{t("warehouse.status.Active")}</SelectItem>
                  <SelectItem value="Maintenance">{t("warehouse.status.Maintenance")}</SelectItem>
                  <SelectItem value="Inactive">{t("warehouse.status.Inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">{t("warehouse.type")}</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Distribution Center">{t("warehouse.type.DistributionCenter")}</SelectItem>
                  <SelectItem value="Regional Hub">{t("warehouse.type.RegionalHub")}</SelectItem>
                  <SelectItem value="Cold Storage">{t("warehouse.type.ColdStorage")}</SelectItem>
                  <SelectItem value="Backup Storage">{t("warehouse.type.BackupStorage")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">{t("warehouse.temperature")}</Label>
              <Select value={formData.temperature} onValueChange={(value) => handleInputChange("temperature", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ambient">{t("warehouse.temperature.Ambient")}</SelectItem>
                  <SelectItem value="Refrigerated">{t("warehouse.temperature.Refrigerated")}</SelectItem>
                  <SelectItem value="Frozen">{t("warehouse.temperature.Frozen")}</SelectItem>
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
            <Label htmlFor="description">{t("warehouse.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
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
