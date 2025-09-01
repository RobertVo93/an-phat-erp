import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { Utility } from "@/types/utility"
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { formatLargeCurrency, getUtilityStatusColor } from "@/lib/utils"

interface UtilityListProps {
  utilities: Utility[]
  onView: (utility: Utility) => void
  onEdit: (utility: Utility) => void
  onDelete: (utility: Utility) => void
}

export const UtilityList: React.FC<UtilityListProps> = ({
  utilities,
  onView,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      {utilities.map((utility) => {
        return (
          <div
            key={utility.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-sm font-medium">{utility.name!}</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h3 className="text-sm font-medium">{t(`utilities.${utility.status!.toLowerCase()}`)}</h3>
                  <Badge className={getUtilityStatusColor(utility.status!)}>
                    {t(`utilities.${utility.status!.toLowerCase()}`)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>{t("utilities.provider")}: {utility.provider}</div>
                  <div>{t("utilities.location")}: {utility.location}</div>
                  <div>{t("utilities.costPerUnit")}: {formatLargeCurrency(utility.costPerUnit!)}/{t(`utilities.${utility.unit!.toLowerCase()}`)}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(utility)}>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("utilities.view")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(utility)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("utilities.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(utility)} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("utilities.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}

