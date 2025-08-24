import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import React from "react"
import { Warehouse } from "@/types"
import { useLanguage } from "@/contexts/language-context"
import { getWarehouseStatusColor } from "@/lib/utils"

interface WarehouseListProps {
    warehouses: Warehouse[]
    onView: (warehouse: Warehouse) => void
    onEdit: (warehouse: Warehouse) => void
    onDelete: (warehouse: Warehouse) => void
}

export const WarehouseList = ({
    warehouses,
    onView,
    onEdit,
    onDelete,
}: WarehouseListProps) => {
    const { t } = useLanguage()
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("warehouse.facilities")}</CardTitle>
                <CardDescription>{t("warehouse.facilitiesOverview")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {warehouses.map((warehouse) => {
                        return (
                            <div
                                key={warehouse.id}
                                className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-4 lg:space-y-0
                                    ${warehouse.main ? "border-red-500" : ""}`}
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <h4 className="text-sm font-medium">{warehouse.number}</h4>
                                        <h3 className="text-sm font-medium">{warehouse.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className={getWarehouseStatusColor(warehouse.status!)}>
                                                {t(`warehouse.status.${warehouse.status}`)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        {warehouse.description}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <span>
                                            {t("warehouse.manager")}: {warehouse.manager || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <span>
                                            {t("warehouse.address")}: {warehouse.address || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <span>
                                            {t("warehouse.phone")}: {warehouse.phone || "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <span>
                                            {t("warehouse.email")}: {warehouse.email || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onView(warehouse)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                {t("warehouse.viewDetails")}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEdit(warehouse)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                {t("warehouse.edit")}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(warehouse)} className="text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {t("warehouse.delete")}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
