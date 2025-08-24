"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, Calendar, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Warehouse } from "@/types"
import { formatDateTime, getWarehouseStatusColor, groupWarehouseProductsByProduct } from "@/lib/utils"

interface WarehouseViewModalProps {
  isOpen: boolean
  onClose: () => void
  warehouse: Warehouse | null
}

export function WarehouseViewModal({ isOpen, onClose, warehouse }: WarehouseViewModalProps) {
  const { t } = useLanguage()

  if (!warehouse) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("warehouse.warehouseDetails")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{warehouse.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {warehouse.number}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getWarehouseStatusColor(warehouse.status!)}>{t(`warehouse.status.${warehouse.status}`)}</Badge>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t("warehouse.basicInfo")}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("warehouse.manager")}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.manager || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("warehouse.address")}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("warehouse.email")}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.email || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("warehouse.phone")}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products information */}
          {warehouse.warehouseProducts?.length! > 0 &&
            <div>
              <h4 className="font-medium text-base">{t("warehouse.products")}</h4>
              {groupWarehouseProductsByProduct(warehouse.warehouseProducts!).map((item, ind) => (
                <p className="text-sm text-muted-foreground" key={ind}>
                  {item.product?.name} - {item.totalQuantity} {t("warehouse.items")}
                </p>
              ))}
            </div>
          }

          {/* Description */}
          {warehouse.description && (
            <div className="space-y-2">
              <h4 className="font-medium text-base">{t("warehouse.input.description")}</h4>
              <p className="text-sm text-muted-foreground">{warehouse.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("warehouse.createdAt")}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(warehouse.createdAt!)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("warehouse.updatedAt")}</p>
                <p className="text-sm text-muted-foreground">{formatDateTime(warehouse.updatedAt!)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
