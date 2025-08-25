import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import React from "react"
import { formatLargeCurrency } from "@/lib/utils"
import { IProductionElement } from "@/types/production"

interface ProductionExpensesSummaryProps {
    selectedMaterials: IProductionElement[]
    selectedUtilities: IProductionElement[]
    selectedEmployees: IProductionElement[]
    calculateTotalCost: () => number
    quantity: number
}

export const ProductionExpensesSummary = ({ selectedMaterials, selectedUtilities, selectedEmployees, calculateTotalCost, quantity }: ProductionExpensesSummaryProps) => {
    const { t } = useLanguage()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base sm:text-lg">{t("production.form.expensesSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>{t("production.form.materialExpense")}:</span>
                        <span className="font-medium">
                            {formatLargeCurrency(selectedMaterials.filter((e) => typeof e.totalCost === "number").reduce((sum: number, e) => sum + (e.totalCost ?? 0), 0))}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("production.form.utilityExpense")}:</span>
                        <span className="font-medium">
                            {formatLargeCurrency(selectedUtilities.filter((e) => typeof e.totalCost === "number").reduce((sum: number, e) => sum + (e.totalCost ?? 0), 0))}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("production.form.laborExpense")}:</span>
                        <span className="font-medium">
                            {formatLargeCurrency(selectedEmployees.filter((e) => typeof e.totalCost === "number").reduce((sum: number, e) => sum + (e.totalCost ?? 0), 0))}
                        </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base font-semibold">
                        <span>{t("production.form.totalExpense")}:</span>
                        <span>{formatLargeCurrency(calculateTotalCost())}</span>
                    </div>
                    {(quantity) && (
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{t("production.form.expensePerUnit")}:</span>
                            <span>{formatLargeCurrency(calculateTotalCost() / quantity)}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
