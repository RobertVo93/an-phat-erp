"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import type { ISetting, SettingValue } from "@/types/setting.interface"
import { settingConfigTypes, settingKeysByConfigType } from "./setting.constants"
import { getSettingTypeLabel } from "./setting-type-label"
import { Loader2 } from "lucide-react"

const defaultSetting: ISetting = {
  value: "",
  description: "",
}

interface SettingFormModalProps {
  isOpen: boolean
  setting: ISetting | null
  onClose: () => void
  onUpdate: (id: string, updates: Partial<ISetting>) => Promise<void>
}

export function SettingFormModal({
  isOpen,
  setting,
  onClose,
  onUpdate,
}: SettingFormModalProps) {
  const { t } = useLanguage()
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ISetting>(defaultSetting)
  const [valueText, setValueText] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const availableKeys = useMemo(() => {
    const configType = formData.configType || settingConfigTypes[0]
    return [...settingKeysByConfigType[configType]]
  }, [formData.configType])

  useEffect(() => {
    if (setting) {
      setFormData(setting)
      setValueText(formatSettingValueForEdit(setting.value))
    } else {
      setFormData(defaultSetting)
      setValueText(formatSettingValueForEdit(defaultSetting.value))
    }
    setErrors({})
    setSubmitting(false)
  }, [setting, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!valueText.trim()) {
      newErrors.value = t("settings.valueRequired")
    } else if (!isPlainTextSetting(setting?.value)) {
      try {
        JSON.parse(valueText)
      } catch {
        newErrors.value = t("settings.valueInvalidJson")
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const parsedValue = parseSettingValueFromInput(valueText, setting?.value)
    const settingData = {
      value: parsedValue,
      description: formData.description,
    }

    if (setting?.id) {
      setSubmitting(true)
      try {
        await onUpdate(setting.id, settingData)
      }
      finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("settings.editSetting")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settingConfigType">{t("settings.configType")} *</Label>
              <Select value={formData.configType || ""} disabled>
                <SelectTrigger id="settingConfigType">
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
              <Label htmlFor="settingKey">{t("settings.key")} *</Label>
              <Select value={formData.key || ""} disabled>
                <SelectTrigger id="settingKey">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableKeys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {getSettingTypeLabel(key, t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="settingValue">{t("settings.value")} *</Label>
              <Textarea
                id="settingValue"
                value={valueText}
                onChange={(e) => setValueText(e.target.value)}
                placeholder={t("settings.value")}
                rows={12}
                className="font-mono text-sm"
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settingDescription">{t("settings.description")}</Label>
            <Textarea
              id="settingDescription"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("settings.description")}
              rows={3}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
              {t("settings.cancel")}
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1 sm:flex-none">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("settings.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )

}

function isPlainTextSetting(value: unknown): value is string {
  return typeof value === "string"
}

function formatSettingValueForEdit(value: unknown): string {
  if (isPlainTextSetting(value)) return value
  return JSON.stringify(value ?? {}, null, 2)
}

function parseSettingValueFromInput(valueText: string, originalValue: unknown): SettingValue {
  if (isPlainTextSetting(originalValue)) return valueText
  return JSON.parse(valueText) as SettingValue
}
