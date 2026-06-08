"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import type { ISetting, SettingKey } from "@/types/setting.interface"
import { Settings as SettingsIcon } from "lucide-react"
import { settingConfigTypes, settingKeysByConfigType } from "./setting.constants"
import { getSettingTypeLabel } from "./setting-type-label"

interface SettingViewModalProps {
  isOpen: boolean
  onClose: () => void
  setting: ISetting | null
}

export function SettingViewModal({ isOpen, onClose, setting }: SettingViewModalProps) {
  const { t } = useLanguage()
  if (!setting) return null

  const keyOptions: SettingKey[] = setting.configType ? [...settingKeysByConfigType[setting.configType]] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {t("settings.viewSetting")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="settingViewConfigType">{t("settings.configType")}</Label>
            <Select value={setting.configType || ""} disabled>
              <SelectTrigger id="settingViewConfigType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {settingConfigTypes.map((configType) => (
                  <SelectItem key={configType} value={configType}>
                    {getSettingTypeLabel(configType, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settingViewKey">{t("settings.key")}</Label>
            <Select value={setting.key || ""} disabled>
              <SelectTrigger id="settingViewKey">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {keyOptions.map((key) => (
                  <SelectItem key={key} value={key}>
                    {getSettingTypeLabel(key, t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="settingViewValue">{t("settings.value")}</Label>
            <Textarea
              id="settingViewValue"
              value={formatJsonValue(setting.value)}
              readOnly
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="settingViewDescription">{t("settings.description")}</Label>
            <Textarea
              id="settingViewDescription"
              value={setting.description || ""}
              readOnly
              rows={3}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function formatJsonValue(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2)
}
