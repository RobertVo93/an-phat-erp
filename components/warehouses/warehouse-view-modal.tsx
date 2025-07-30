"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package, User, Phone, Mail, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Warehouse, WarehouseStatus, WarehouseType } from "@/types"
import { formatDate, groupWarehouseProductsByProduct } from "@/lib/utils"

interface WarehouseViewModalProps {
  isOpen: boolean
  onClose: () => void
  warehouse: Warehouse | null
}

export function WarehouseViewModal({ isOpen, onClose, warehouse }: WarehouseViewModalProps) {
  const { t } = useLanguage()

  if (!warehouse) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case WarehouseStatus.active:
        return "bg-green-100 text-green-800"
      case WarehouseStatus.maintenance:
        return "bg-yellow-100 text-yellow-800"
      case WarehouseStatus.inactive:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case WarehouseType.distributionCenter:
        return "bg-blue-100 text-blue-800"
      case WarehouseType.regionalHub:
        return "bg-purple-100 text-purple-800"
      case WarehouseType.coldStorage:
        return "bg-cyan-100 text-cyan-800"
      case WarehouseType.backupStorage:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const utilization = Math.round((warehouse.occupied! / warehouse.capacity!) * 100)
  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

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
              <p className="text-sm text-muted-foreground">ID: {warehouse.id}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(warehouse.status!)}>{t(`warehouse.status.${warehouse.status}`)}</Badge>
              <Badge variant="outline" className={getTypeColor(warehouse.type!)}>
                {t(`warehouse.type.${warehouse.type!.replace(/\s+/g, "")}`)}
              </Badge>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t("warehouse.basicInfo")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("warehouse.location")}</p>
                  <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("warehouse.manager")}</p>
                  <p className="text-sm text-muted-foreground">{warehouse.manager}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">{t("warehouse.address")}</p>
              <p className="text-sm text-muted-foreground">{warehouse.address}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">{t("warehouse.zones")}</p>
                <p className="text-sm text-muted-foreground">
                  {warehouse.zones} {t("warehouse.zones")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{t("warehouse.temperature")}</p>
                <p className="text-sm text-muted-foreground">{t(`warehouse.temperature.${warehouse.temperature}`)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{t("warehouse.type")}</p>
                <p className="text-sm text-muted-foreground">
                  {t(`warehouse.type.${warehouse.type!.replace(/\s+/g, "")}`)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(warehouse.phone || warehouse.email) && (
            <div className="space-y-4">
              <h4 className="font-medium text-base">{t("warehouse.contactInfo")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warehouse.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("warehouse.phone")}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.phone}</p>
                    </div>
                  </div>
                )}
                {warehouse.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{t("warehouse.email")}</p>
                      <p className="text-sm text-muted-foreground">{warehouse.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Capacity Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-base">{t("warehouse.capacityInfo")}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("warehouse.capacity")}</p>
                  <p className="text-sm text-muted-foreground">
                    {warehouse.capacity!.toLocaleString()} {t("warehouse.squareMeters")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("warehouse.occupied")}</p>
                  <p className="text-sm text-muted-foreground">
                    {warehouse.occupied!.toLocaleString()} {t("warehouse.squareMeters")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("warehouse.utilization")}</p>
                  <p className={`text-sm font-bold ${getUtilizationColor(utilization)}`}>{utilization}%</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${utilization >= 90 ? "bg-red-500" : utilization >= 75 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                style={{ width: `${utilization}%` }}
              ></div>
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
              <h4 className="font-medium text-base">{t("warehouse.description")}</h4>
              <p className="text-sm text-muted-foreground">{warehouse.description}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("warehouse.createdAt")}</p>
                <p className="text-sm text-muted-foreground">{formatDate(warehouse.createdAt!)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t("warehouse.updatedAt")}</p>
                <p className="text-sm text-muted-foreground">{formatDate(warehouse.updatedAt!)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
