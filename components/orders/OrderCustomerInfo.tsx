import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types"
import { getCustomerInitialCharacter } from "@/lib/utils"

interface OrderCustomerInfoProps {
    orderData: Order
}

export const OrderCustomerInfo = ({ orderData }: OrderCustomerInfoProps) => {
    const { t } = useLanguage()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{t("orders.customerInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt={orderData?.customer?.name} />
                        <AvatarFallback>{getCustomerInitialCharacter(orderData?.customer?.name!)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{orderData?.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">{orderData?.customer?.company}</p>
                    </div>
                </div>
                <div className="space-y-2 text-sm mb-4">
                    <div>
                        <span className="text-muted-foreground">{t("orders.modal.email")}: </span>
                        <span>{orderData?.customer?.email}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">{t("orders.modal.phone")}: </span>
                        <span>{orderData?.customer?.phone}</span>
                    </div>
                </div>
                <div className="space-y-2 text-sm border-t">
                    <div className="mt-2">
                        <span className="text-muted-foreground">{t("orders.shippingAddress")}: </span>
                        <span>{orderData?.shippingAddress}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">{t("orders.orderNotes")}: </span>
                        <span>{orderData?.notes}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
