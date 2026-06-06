"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import type { ISetting } from "@/types/setting.interface"
import { Edit, Eye, MoreVertical } from "lucide-react"

interface SettingActionsProps {
  setting: ISetting
  className?: string
  onView: (setting: ISetting) => void
  onEdit: (setting: ISetting) => void
}

export function SettingActions({ setting, className, onView, onEdit }: SettingActionsProps) {
  const { t } = useLanguage()

  return (
    <div className={cn("flex w-full items-center justify-start", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(setting)}>
            <Eye className="mr-2 h-4 w-4" />
            {t("settings.view")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(setting)}>
            <Edit className="mr-2 h-4 w-4" />
            {t("settings.edit")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
