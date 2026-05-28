"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MutationMode } from "@/types/base.interface"
import { UtilityUnit, UtilityUsageStatus } from "@/types/enums"
import type { IUtilityUsage, IUser, Utility } from "@/types"
import { useLanguage } from "@/contexts/language-context"
import { Calendar } from "../ui/calendar"
import { Loader2 } from "lucide-react"
import { getRecentTimeIntervalSlot } from "@/lib/utils"

interface UtilityUsageFormModalProps {
  isOpen: boolean
  mode: MutationMode
  record?: IUtilityUsage | null
  utilities: Utility[]
  approvers: IUser[]
  loading?: boolean
  onClose: () => void
  onSave: (payload: Omit<IUtilityUsage, "id" | "createdAt" | "updatedAt">) => void
  onUpdate: (id: string, payload: Partial<IUtilityUsage>) => void
}

const defaultRecord: IUtilityUsage = {
  usageTime: getRecentTimeIntervalSlot(),
  totalUsage: 0,
  status: UtilityUsageStatus.draft,
  note: "",
}

export function UtilityUsageFormModal({
  isOpen,
  mode,
  record,
  utilities,
  approvers,
  loading = false,
  onClose,
  onSave,
  onUpdate,
}: UtilityUsageFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<IUtilityUsage>(defaultRecord)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (mode === "update" && record) {
      setFormData({
        ...record,
        usageTime: record.usageTime ? new Date(record.usageTime) : new Date(),
      })
    } else {
      setFormData(defaultRecord)
    }
    setErrors({})
  }, [mode, record, isOpen])

  const isAmountPairProvided =
    formData.amountBefore !== undefined &&
    formData.amountBefore !== null &&
    formData.amountAfter !== undefined &&
    formData.amountAfter !== null

  const computedTotalUsage = useMemo(() => {
    if (!isAmountPairProvided) return undefined
    const before = Number(formData.amountBefore || 0)
    const after = Number(formData.amountAfter || 0)
    return after - before
  }, [formData.amountBefore, formData.amountAfter, isAmountPairProvided])

  const totalUsage = isAmountPairProvided ? computedTotalUsage : formData.totalUsage

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!formData.utility?.id) nextErrors.utility = t("utilityUsage.validation.utilityRequired")
    if (!formData.usageTime) nextErrors.usageTime = t("utilityUsage.validation.usageTimeRequired")
    if (isAmountPairProvided && Number(formData.amountAfter || 0) < Number(formData.amountBefore || 0)) {
      nextErrors.amountAfter = t("utilityUsage.validation.amountAfterInvalid")
    }
    if (Number(totalUsage ?? 0) < 0) {
      nextErrors.totalUsage = t("utilityUsage.validation.totalUsageInvalid")
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSelectUtility = (utilityId: string) => {
    const selected = utilities.find((item) => item.id === utilityId)
    if (!selected) return

    setFormData((prev) => ({
      ...prev,
      utility: { id: selected.id, name: selected.name, number: selected.number, unit: selected.unit },
      unit: selected.unit,
    }))
  }

  const handleSubmit = () => {
    if (!validate()) return

    const payload: Omit<IUtilityUsage, "id" | "createdAt" | "updatedAt"> = {
      usageTime: formData.usageTime,
      utility: formData.utility,
      amountBefore: formData.amountBefore,
      amountAfter: formData.amountAfter,
      totalUsage: totalUsage ?? 0,
      unit: formData.unit,
      status: formData.status || UtilityUsageStatus.draft,
      note: formData.note,
      approver: formData.approver?.id ? { id: formData.approver.id } : undefined,
    }

    if (mode === "update" && record?.id) {
      onUpdate(record.id, payload)
      return
    }

    onSave(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "update" ? t("utilityUsage.editTitle") : t("utilityUsage.addTitle")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>{t("utilityUsage.utility")} *</Label>
            <Select value={formData.utility?.id} onValueChange={handleSelectUtility}>
              <SelectTrigger className={errors.utility ? "border-red-500" : ""}>
                <SelectValue placeholder={t("utilityUsage.selectUtility")} />
              </SelectTrigger>
              <SelectContent>
                {utilities.map((utility) => (
                  <SelectItem key={utility.id} value={utility.id!}>
                    {utility.number} - {utility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.utility && <p className="text-sm text-red-500">{errors.utility}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("utilityUsage.usageTime")} *</Label>
            <Calendar
              selected={formData.usageTime || new Date()}
              onChange={(value) => setFormData((prev) => ({ ...prev, usageTime: value || new Date() }))}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              className={errors.usageTime ? "border-red-500" : ""}
              showIcon
              timeIntervals={15}
            />
            {errors.usageTime && <p className="text-sm text-red-500">{errors.usageTime}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("utilityUsage.status")}</Label>
            <Select
              value={formData.status || UtilityUsageStatus.draft}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as UtilityUsageStatus }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UtilityUsageStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`utilityUsage.status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("utilityUsage.amountBefore")}</Label>
            <Input
              type="number"
              value={formData.amountBefore ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amountBefore: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              className={errors.amountBefore ? "border-red-500" : ""}
            />
            {errors.amountBefore && <p className="text-sm text-red-500">{errors.amountBefore}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("utilityUsage.amountAfter")}</Label>
            <Input
              type="number"
              value={formData.amountAfter ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amountAfter: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
              className={errors.amountAfter ? "border-red-500" : ""}
            />
            {errors.amountAfter && <p className="text-sm text-red-500">{errors.amountAfter}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("utilityUsage.totalUsage")}</Label>
            <Input
              type="number"
              value={totalUsage ?? ""}
              disabled={isAmountPairProvided}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalUsage: e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
            {errors.totalUsage && <p className="text-sm text-red-500">{errors.totalUsage}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t("utilityUsage.unit")}</Label>
            <Select
              value={formData.unit}
              onValueChange={(value: UtilityUnit) => setFormData((prev) => ({ ...prev, unit: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("common.select")} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UtilityUnit).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t("utilityUsage.approver")}</Label>
            <Select
              value={formData.approver?.id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, approver: { id: value } }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("utilityUsage.selectApprover")} />
              </SelectTrigger>
              <SelectContent>
                {approvers.map((user) => (
                  <SelectItem key={user.id} value={user.id!}>
                    {user.fullName || user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t("utilityUsage.note")}</Label>
            <Textarea
              rows={3}
              value={formData.note || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>{t("common.cancel")}</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "update" ? t("common.update") : t("common.create")}
              </>
            ) : (
              t("common.save")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
