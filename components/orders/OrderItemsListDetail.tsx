import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types"

interface OrderItemsListDetailProps {
    orderData: Order
    formatCurrency: (amount: number) => string
}
export const OrderItemsListDetail = ({ orderData, formatCurrency }: OrderItemsListDetailProps) => {
    const { t } = useLanguage()

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("orders.orderItems")}</CardTitle>
                <CardDescription>{t("orders.includedProducts")}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orderData.items!.map((item: any) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{item.product?.name}</h3>
                                <p className="text-sm text-muted-foreground">SKU: {item.product?.name}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">{t("orders.quantity")}</p>
                                <p className="font-medium">{item.quantity}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">{t("orders.unitPrice")}</p>
                                <p className="font-medium">{formatCurrency(item.unitPrice!)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">{t("orders.total")}</p>
                                <p className="font-bold">{formatCurrency(item.total!)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
