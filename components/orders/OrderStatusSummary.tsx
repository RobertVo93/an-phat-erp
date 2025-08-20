import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { PaymentMethod } from "@/types/enums"
import { Order } from "@/types"
import { getOrderStatusColor, getPaymentStatusColor } from "@/lib/utils"

interface OrderStatusSummaryProps {
    orderData: Order
    getStatusText: (status: string) => string
    getPaymentStatusText: (status: string) => string
    formatDate: (date: string) => string
}

export const OrderStatusSummary = ({
    orderData,
    getStatusText,
    getPaymentStatusText,
    formatDate
}: OrderStatusSummaryProps) => {
    const { t } = useLanguage()

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case PaymentMethod.creditCard:
                return t("orders.paymentMethod.creditCard")
            case PaymentMethod.debitCard:
                return t("orders.paymentMethod.debitCard")
            case PaymentMethod.bankTransfer:
                return t("orders.paymentMethod.bankTransfer")
            case PaymentMethod.cash:
                return t("orders.paymentMethod.cash")
            case PaymentMethod.paypal:
                return t("orders.paymentMethod.paypal")
            default:
                return method
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{t("orders.status")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("orders.status")}:</span>
                        <Badge className={getOrderStatusColor(orderData?.status!)}>{getStatusText(orderData?.status!)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("orders.paymentStatus")}:</span>
                        <Badge className={getPaymentStatusColor(orderData?.paymentStatus!)}>
                            {getPaymentStatusText(orderData?.paymentStatus!)}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{t("orders.paymentMethod")}:</p>
                        <p className="font-medium">{getPaymentMethodText(orderData?.paymentMethod!)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("orders.expectedDelivery")}:</span>
                        <span className="text-sm font-medium">{formatDate(orderData?.deliveryDate?.toString()!)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("orders.warehouse")}:</span>
                        <span className="text-sm font-medium">{orderData.warehouse?.name!}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
