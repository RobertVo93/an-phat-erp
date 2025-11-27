import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types"
import { Separator } from "@/components/ui/separator"

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
                <div>
                    <div>{t("orders.modal.purchaser")}:</div>
                    <div className="space-y-2 text-sm mb-4 mt-2">
                        <div>
                            <span className="text-muted-foreground">{t("orders.modal.name")}: </span>
                            <span className="font-medium">{orderData?.customer?.name}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">{t("orders.modal.email")}: </span>
                            <span>{orderData?.customer?.email}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">{t("orders.modal.phone")}: </span>
                            <span>{orderData?.customer?.phone}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="mt-2">
                    <div>{t("orders.modal.receiver")}:</div>
                    <div className="space-y-2 text-sm mb-4 mt-2">
                        <div>
                            <span className="text-muted-foreground">{t("orders.modal.name")}: </span>
                            <span className="font-medium">{orderData?.receiverInfo?.name}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">{t("orders.modal.phone")}: </span>
                            <span className="font-medium">{orderData?.receiverInfo?.phone}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                    <div className="mt-2">
                        <span className="text-muted-foreground">{t("orders.shippingAddress")}: </span>
                        <span className="font-medium">{orderData?.shippingAddress}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">{t("orders.orderNotes")}: </span>
                        <span className="font-medium">{orderData?.notes}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
