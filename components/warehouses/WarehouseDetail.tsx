import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import React from "react"
import { User, Phone, Mail, Calendar, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Product, Warehouse } from "@/types"
import { formatDateTime } from "@/lib/utils"
import { WarehouseProductTable } from "@/components/warehouses/WarehouseProductTable"

interface Props {
  warehouse: Warehouse
  onOpenTransferModal: (product: Product) => void
}

export const WarehouseDetail = ({
  warehouse,
  onOpenTransferModal,
}: Props) => {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{warehouse.name}</CardTitle>
        <CardDescription>ID: {warehouse.number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          <div hidden={!warehouse?.warehouseProducts || warehouse.warehouseProducts.length === 0}>
            <WarehouseProductTable
              warehouse={warehouse}
              onOpenTransferModal={onOpenTransferModal}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}