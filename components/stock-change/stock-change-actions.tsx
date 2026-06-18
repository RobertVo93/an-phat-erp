"use client"

import { CheckCheck, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { StockChange, StockChangeStatus } from "@/types"

interface IStockChangeActionsProps {
  stockChange: StockChange
  onView: (stockChange: StockChange) => void
  onEdit: (stockChange: StockChange) => void
  onDelete: (stockChange: StockChange) => void
  onAutoComplete: (stockChange: StockChange) => void
}

export function StockChangeActions({
  stockChange,
  onView,
  onEdit,
  onDelete,
  onAutoComplete,
}: IStockChangeActionsProps) {
  const { t } = useLanguage()
  const isCompleted = stockChange.status === StockChangeStatus.completed

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(event) => {
            event.stopPropagation()
            onView(stockChange)
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("stockIn.view")}
        </DropdownMenuItem>

        {!isCompleted && (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation()
              onEdit(stockChange)
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t("stockIn.edit")}
          </DropdownMenuItem>
        )}

        {!isCompleted && (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation()
              onAutoComplete(stockChange)
            }}
            className="text-green-600"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {t("stockIn.form.completeNow")}
          </DropdownMenuItem>
        )}

        {!isCompleted && (
          <DropdownMenuItem
            onClick={(event) => {
              event.stopPropagation()
              onDelete(stockChange)
            }}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("stockIn.delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
