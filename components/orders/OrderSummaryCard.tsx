import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types"

interface OrderSummaryCardProps {
    subtotal: number
    orderData: Order
    formatCurrency: (amount: number) => string
}

export const OrderSummaryCard = ({ subtotal, orderData, formatCurrency }: OrderSummaryCardProps) => {
    const { t } = useLanguage()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{t("orders.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("orders.subtotal")}:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {
                        orderData?.tax && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t("orders.tax")}:</span>
                                <span>{formatCurrency(orderData?.tax!)}</span>
                            </div>
                        )
                    }
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("orders.shipping")}:</span>
                        <span>{orderData?.shippingFee! === 0 ? t("orders.free") : formatCurrency(orderData?.shippingFee!)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>{t("orders.total")}:</span>
                        <span>{formatCurrency(orderData?.totalAmount!)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
