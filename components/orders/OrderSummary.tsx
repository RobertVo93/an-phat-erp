import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import React from "react"

interface OrderSummaryProps {
    subtotal: string
    tax: string
    shipping: string
    total: string
}

export const OrderSummary = ({ subtotal, tax, shipping, total }: OrderSummaryProps) => {
    const { t } = useLanguage()
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{t("orders.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>{t("orders.subtotal")}:</span>
                        <span>{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("orders.modal.taxRate")}:</span>
                        <span>{tax}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("orders.shipping")}:</span>
                        <span>{shipping}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>{t("orders.total")}:</span>
                        <span>{total}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
