"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import type { Utility } from "@/types/utility"
import { formatDateTime, formatLargeCurrency, getUtilityStatusColor } from "@/lib/utils"

interface UtilityViewModalProps {
  isOpen: boolean
  utility: Utility | null
  onClose: () => void
}

export function UtilityViewModal({ isOpen, utility, onClose }: UtilityViewModalProps) {
  const { t } = useLanguage()

  if (!utility) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {t("utilities.viewUtility")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{utility.number} - {utility.name!.toLowerCase()}</h3>
            </div>
            <Badge className={getUtilityStatusColor(utility.status!)}>{t(`utilities.${utility.status!.toLowerCase()}`)}</Badge>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
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
                <label className="text-sm font-medium text-muted-foreground">{t("utilities.status")}</label>
                <p className="text-sm">{t(`utilities.${utility.status!.toLowerCase()}`)}</p>
              </div>
            </div>
          </div>

          {/* Usage & Cost Information */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">{t("utilities.information")}</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t("utilities.costPerUnit")}</p>
                <p className="text-lg font-semibold">
                  {formatLargeCurrency(utility.costPerUnit!)}/{t(`utilities.${utility.unit!.toLowerCase()}`)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {utility.description && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("utilities.description")}</label>
              <p className="text-sm mt-1 p-3 rounded-lg">{utility.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("utilities.createdAt")}</label>
              <p className="text-sm">{formatDateTime(utility.createdAt!)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t("utilities.lastUpdated")}</label>
              <p className="text-sm">{formatDateTime(utility.updatedAt!)}</p>
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
