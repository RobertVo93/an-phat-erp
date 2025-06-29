"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Zap, Droplets, Thermometer, Wifi, Phone, Tv, Shield, BrushIcon as Broom } from "lucide-react"
import type { Utility } from "@/types/utility"
import { UtilityStatus, UtilityType } from "@/types"

interface UtilityViewModalProps {
  isOpen: boolean
  onClose: () => void
  utility: Utility | null
}

export function UtilityViewModal({ isOpen, onClose, utility }: UtilityViewModalProps) {
  const { t } = useLanguage()

  if (!utility) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case UtilityStatus.active:
        return "bg-green-100 text-green-800"
      case UtilityStatus.overdue:
        return "bg-red-100 text-red-800"
      case UtilityStatus.inactive:
        return "bg-yellow-100 text-yellow-800"
      case UtilityStatus.disconnected:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUtilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case UtilityType.electricity:
        return Zap
      case UtilityType.water:
        return Droplets
      case UtilityType.gas:
        return Thermometer
      case UtilityType.internet:
        return Wifi
      case UtilityType.phone:
        return Phone
      case UtilityType.cable:
        return Tv
      case UtilityType.security:
        return Shield
      case UtilityType.cleaning:
        return Broom
      default:
        return Zap
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const UtilityIcon = getUtilityIcon(utility.type!)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UtilityIcon className="h-6 w-6 text-gray-600" />
            </div>
            {t("utilities.viewUtility")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{t(`utilities.${utility.type!.toLowerCase()}`)}</h3>
              <p className="text-sm text-muted-foreground">{utility.provider}</p>
            </div>
            <Badge className={getStatusColor(utility.status!)}>{t(`utilities.${utility.status!.toLowerCase()}`)}</Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.accountNumber")}</label>
                <p className="text-sm">{utility.accountNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.location")}</label>
                <p className="text-sm">{utility.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.provider")}</label>
                <p className="text-sm">{utility.provider}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.dueDate")}</label>
                <p className="text-sm">{formatDate(utility.dueDate!)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.lastReading")}</label>
                <p className="text-sm">{formatDate(utility.lastReading!)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.status")}</label>
                <p className="text-sm">{t(`utilities.${utility.status!.toLowerCase()}`)}</p>
              </div>
            </div>
          </div>

          {/* Usage & Cost Information */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Usage & Cost Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("utilities.monthlyUsage")}</p>
                <p className="text-lg font-semibold">
                  {utility.monthlyUsage} {t(`utilities.${utility.unit!.toLowerCase()}`)}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("utilities.costPerUnit")}</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(utility.costPerUnit!)}/{t(`utilities.${utility.unit!.toLowerCase()}`)}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("utilities.monthlyCost")}</p>
                <p className="text-lg font-semibold">{formatCurrency(utility.monthlyCost!)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {utility.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("utilities.description")}</label>
              <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{utility.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-sm">{formatDate(utility.createdAt!.toString())}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-sm">{formatDate(utility.updatedAt!.toString())}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>{t("utilities.cancel")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
