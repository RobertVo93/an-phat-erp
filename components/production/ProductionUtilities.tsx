import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { IProductionElement } from "@/types/production"
import { Utility } from "@/types"
import { formatLargeCurrency } from "@/lib/utils"

interface ProductionUtilitiesProps {
    selectedUtilities: IProductionElement[]
    addUtility: () => void
    updateUtility: (index: number, field: string, value: any) => void
    removeUtility: (index: number) => void
    availableUtilities: Utility[]
    error: string
}

export const ProductionUtilities = ({ selectedUtilities, addUtility, updateUtility, removeUtility, availableUtilities, error }: ProductionUtilitiesProps) => {
    const { t } = useLanguage()
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold">{t("production.form.utility")}</h3>
                <Button variant="outline" size="sm" onClick={addUtility} className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    {t("production.form.add")}
                </Button>
            </div>
            <div className="space-y-3">
                {selectedUtilities.map((utility, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">{t("production.form.utility")}</Label>
                                <Select value={utility.id} onValueChange={(value) => updateUtility(index, "id", value)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={t("production.form.select")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUtilities
                                            .filter((util) =>
                                                util.id === utility.id ||
                                                !selectedUtilities.some((selected, i) =>
                                                    i !== index && selected?.id === util.id
                                                )
                                            )
                                            .map((util, ind) => (
                                                <SelectItem key={ind} value={util.id!}>
                                                    {util.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t("production.form.quantity")}</Label>
                                <FormattedNumber
                                    as="input"
                                    placeholder="1"
                                    min={1}
                                    value={utility.quantity}
                                    onValueChange={(value) => {
                                        updateUtility(index, "quantity", value);
                                    }}
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">{t("production.form.unitCost")}</Label>
                                <FormattedCurrency
                                    as="input"
                                    placeholder="1"
                                    value={utility.unitCost}
                                    onValueChange={(value) => {
                                        updateUtility(index, "unitCost", value);
                                    }}
                                    className="h-9"
                                />
                            </div>
                        </div>
                        {utility?.id &&
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-gray-600">{t("production.form.unit")}: </span>
                                    <span className="font-medium">{utility.unit && t(`production.form.${utility.unit}`)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                                    <span className="font-medium">{formatLargeCurrency(utility.totalCost ?? 0)}</span>
                                </div>
                            </div>
                        }
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeUtility(index)}
                            className="w-full text-red-600 text-xs"
                        >
                            {t("production.form.remove")}
                        </Button>
                    </div>
                ))}
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </div>
    )
}
