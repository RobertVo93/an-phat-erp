import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { IProductionElement } from "@/types/production"
import { Utility } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { QuantitySelector } from "../common/quantity-selector"

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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("production.form.quantity")}</Label>
                                    <QuantitySelector
                                        quantity={utility.quantity ?? 0}
                                        showAction={false}
                                        onQuantityChange={(newValue) => updateUtility(index, "quantity", newValue)}
                                        className="h-9"
                                        inputClassName="text-left"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("production.form.unitCost")}</Label>
                                    <QuantitySelector
                                        quantity={utility.unitCost ?? 0}
                                        showAction={false}
                                        onQuantityChange={(newValue) => updateUtility(index, "unitCost", newValue)}
                                        className="h-9"
                                        inputClassName="text-left"
                                    />
                                </div>
                            </div>
                        </div>
                        {utility?.id &&
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="col-span-1">
                                    <span className="text-gray-600">{t("production.form.unit")}: </span>
                                    <span className="font-medium">{utility.unit && t(`production.form.${utility.unit}`)}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                                    <span className="font-medium">{formatCurrency(utility.totalCost ?? 0)}</span>
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
