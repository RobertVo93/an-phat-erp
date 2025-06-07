"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Customer } from "@/types/customer"
import { useLanguage } from "@/contexts/language-context"
import { CustomerStatus, CustomerType } from "@/types/enums"

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (customer: Omit<Customer, "id"> | Customer) => void
  customer?: Customer
  mode: "create" | "edit"
}

export function CustomerFormModal({ isOpen, onClose, onSave, customer, mode }: CustomerFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    customerType: CustomerType.regular,
    status: CustomerStatus.active,
    notes: "",
    lastOrder: undefined,
    joinDate: new Date(),
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (customer && mode === "edit") {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || "",
        location: customer.location,
        customerType: customer.customerType as CustomerType,
        status: customer.status as CustomerStatus,
        notes: customer.notes || "",
        lastOrder: customer.lastOrder,
        joinDate: customer.joinDate,
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        location: "",
        customerType: CustomerType.regular,
        status: CustomerStatus.active,
        notes: "",
        lastOrder: undefined,
        joinDate: new Date(),
      })
    }
    setErrors({})
  }, [customer, mode, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name!.trim()) {
      newErrors.name = t("customers.form.nameRequired")
    }
    if (!formData.email!.trim()) {
      newErrors.email = t("customers.form.emailRequired")
    }
    if (!formData.phone!.trim()) {
      newErrors.phone = t("customers.form.phoneRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const customerData = {
      ...formData,
      ...(mode === "edit" && customer ? { id: customer.id } : {}),
    }

    onSave(customerData)
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
          <DialogTitle>{mode === "create" ? t("customers.addCustomer") : t("customers.editCustomer")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("customers.form.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("customers.form.email")} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("customers.form.phone")} *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t("customers.form.company")}</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t("customers.form.location")}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerType">{t("customers.form.customerType")}</Label>
              <Select value={formData.customerType} onValueChange={(value: CustomerType) => handleInputChange("customerType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">{t("customers.type.regular")}</SelectItem>
                  <SelectItem value="premium">{t("customers.type.premium")}</SelectItem>
                  <SelectItem value="vip">{t("customers.type.vip")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t("customers.form.status")}</Label>
              <Select value={formData.status} onValueChange={(value: CustomerStatus) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("customers.status.active")}</SelectItem>
                  <SelectItem value="inactive">{t("customers.status.inactive")}</SelectItem>
                  <SelectItem value="pending">{t("customers.status.pending")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">{t("customers.joined")}</Label>
              <Input
                id="joinDate"
                type="date"
                value={
                  formData.joinDate
                    ? new Date(formData.joinDate.toString().replace(" ", "T")).toLocaleDateString("sv-SE")
                    : ""
                }
                onChange={(e) => handleInputChange("joinDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("customers.form.notes")}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("customers.form.cancel")}
            </Button>
            <Button type="submit">{t("customers.form.save")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
