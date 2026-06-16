import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FormattedCurrency } from "@/components/ui/formatted-currency"
import { useLanguage } from "@/contexts/language-context"
import React from "react"

interface ProductionProfitSummaryProps {
    calculateTotalCost: () => number
    calculateTotalProfit: () => number
    calculateRevenue: () => number
    calculateEfficiency: () => number
}

export const ProductionProfitSummary = ({ calculateTotalCost, calculateTotalProfit, calculateRevenue, calculateEfficiency }: ProductionProfitSummaryProps) => {
    const { t } = useLanguage()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base sm:text-lg">{t("production.form.profitSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-t pt-2 text-base font-semibold">
                        <span>{t("production.form.revenue")}:</span>
                        <FormattedCurrency
                            as="span"
                            value={calculateRevenue()}
                        />
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                        <span>{t("production.form.totalProfit")}:</span>
                        <FormattedCurrency
                            as="span"
                            value={calculateTotalProfit()}
                        />
                    </div>
                    {(calculateTotalProfit() && calculateTotalCost()) ? (
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{t("production.form.efficiency")}:</span>
                            <span>{calculateEfficiency().toFixed(2).toLocaleString()} %</span>
                        </div>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    )
}
