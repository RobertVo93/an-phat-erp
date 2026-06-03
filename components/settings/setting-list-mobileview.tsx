"use client"

import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import type { Setting } from "@/types/setting.interface"
import { SettingActions } from "./setting-actions"
import { getSettingTypeLabel } from "./setting-type-label"
import { SettingValue } from "./setting-value"

interface SettingListMobileViewProps {
  settings: Setting[]
  onView: (setting: Setting) => void
  onEdit: (setting: Setting) => void
}

export function SettingListMobileView({ settings, onView, onEdit }: SettingListMobileViewProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-3">
      {settings.map((setting) => (
        <div key={setting.id} className="rounded-lg border bg-white p-3 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex min-w-0 items-center gap-2">
                <Badge variant="outline" className="shrink-0">
                  {getSettingTypeLabel(setting.configType, t)}
                </Badge>
                <span className="truncate text-sm font-semibold text-gray-900">
                  {getSettingTypeLabel(setting.key, t)}
                </span>
              </div>
              <SettingValue
                setting={setting}
                className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-700"
              />
            </div>
            <SettingActions setting={setting} className="w-auto shrink-0 justify-end" onView={onView} onEdit={onEdit} />
          </div>
          {setting.description && (
            <div className="mt-3 border-t pt-2 text-xs leading-5 text-muted-foreground">
              {setting.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
