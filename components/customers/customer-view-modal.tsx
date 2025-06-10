"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@/types/customer"
import { useLanguage } from "@/contexts/language-context"

import { Mail, Phone, MapPin, Building, Calendar, ShoppingCart, DollarSign } from "lucide-react"
import { CustomerStatus, CustomerType } from "@/types/enums"
import { formatCurrency } from "@/lib/utils"

interface CustomerViewModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export function CustomerViewModal({ isOpen, onClose, customer }: CustomerViewModalProps) {
  const { t } = useLanguage()

  if (!customer) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case CustomerStatus.active:
        return "bg-green-100 text-green-800"
      case CustomerStatus.inactive:
        return "bg-red-100 text-red-800"
      case CustomerStatus.pending:
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case CustomerType.vip:
        return "bg-purple-100 text-purple-800"
      case CustomerType.premium:
        return "bg-blue-100 text-blue-800"
      case CustomerType.regular:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case CustomerStatus.active:
        return t("customers.status.active")
      case CustomerStatus.inactive:
        return t("customers.status.inactive")
      case CustomerStatus.pending:
        return t("customers.status.pending")
      default:
        return status
    }
  }

  const translateCustomerType = (type: string) => {
    switch (type) {
      case CustomerType.vip:
        return t("customers.type.vip")
      case CustomerType.premium:
        return t("customers.type.premium")
      case CustomerType.regular:
        return t("customers.type.regular")
      default:
        return type
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("customers.viewCustomer")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(customer.status!.toString())}>{translateStatus(customer.status!.toString())}</Badge>
              <Badge variant="outline" className={getCustomerTypeColor(customer.customerType!.toString())}>
                {translateCustomerType(customer.customerType!.toString())}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">{t("customers.form.contactInfo")}</h4>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.phone}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.location}</span>
              </div>

              {customer.company && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.company}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg">{t("customers.form.customerDetails")}</h4>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t("customers.joined")}: {new Date(customer.joinDate!.toString().replace(" ", "T")).toLocaleDateString("sv-SE")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {customer.orders?.length} {t("customers.orders")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{formatCurrency(customer.totalSpend!)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t("customers.lastOrder")}: {customer.lastOrder ? new Date(customer.lastOrder.toString().replace(" ", "T")).toLocaleDateString("sv-SE") : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div className="space-y-2">
              <h4 className="font-semibold">{t("customers.form.notes")}</h4>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">{customer.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
