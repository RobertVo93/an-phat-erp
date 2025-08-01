"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@/types/customer"
import { useLanguage } from "@/contexts/language-context"

import { Mail, Phone, MapPin, Building, Calendar, ShoppingCart, DollarSign } from "lucide-react"
import { CustomerStatus, CustomerType } from "@/types/enums"
import { formatCurrency, getCustomerStatusColor, getCustomerTypeColor } from "@/lib/utils"

interface CustomerViewModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export function CustomerViewModal({ isOpen, onClose, customer }: CustomerViewModalProps) {
  const { t } = useLanguage()

  if (!customer) return null

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
              <p className="text-sm text-muted-foreground">ID: {customer.number}</p>
            </div>
            <div className="flex space-x-2">
              <Badge className={getCustomerStatusColor(customer.status!.toString())}>{translateStatus(customer.status!.toString())}</Badge>
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
                <span className="text-sm">{customer.email || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.phone || "N/A"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{customer.location || "N/A"}</span>
              </div>

              {customer.company && (
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.company || "N/A"}</span>
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
                  {customer.orders?.length || 0} {t("customers.orders")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{formatCurrency(customer.totalSpend || 0)}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t("customers.lastOrder")}: {customer.lastOrder ? new Date(customer.lastOrder.toString().replace(" ", "T")).toLocaleDateString("sv-SE") : "N/A"}
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
