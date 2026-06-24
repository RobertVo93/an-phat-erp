import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types"
import { OrderItemRow } from "../common/order-item-row"

interface OrderItemsListDetailProps {
    orderData: Order
}
export const OrderItemsListDetail = ({ orderData }: OrderItemsListDetailProps) => {
    const { t } = useLanguage()

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("orders.orderItems")}</CardTitle>
                <CardDescription>{t("orders.includedProducts")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {orderData.items?.map((item, index) => (
                    <OrderItemRow key={item.id ?? index} item={item} />
                ))}
                </div>
            </CardContent>
        </Card>
    )
}
