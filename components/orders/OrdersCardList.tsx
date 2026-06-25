import { Calendar } from "lucide-react"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ADMIN_ROUTES } from "@/constants/nav"
import { formatCurrency, formatDate, formatDateTime, getOrderStatusColor } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types/order"
import { CustomLink } from "../common/custom-link"

interface OrdersCardListProps {
  orders: Order[]
  getStatusText: (status: string) => string
}

export const OrdersCardList: React.FC<OrdersCardListProps> = ({
  orders,
  getStatusText,
}) => {
  const { t } = useLanguage()
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                <CustomLink href={ADMIN_ROUTES.orderDetail(order.id!)} text={order.number}/>
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {formatDate(order.createdAt!)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.expectedDelivery")}:</span>
                <span className="text-sm font-medium text-red-500">{order.deliveryDate ? formatDateTime(order.deliveryDate) : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.customer")}:</span>
                <CustomLink href={ADMIN_ROUTES.customerDetail(order.customer?.id!)} text={order.customer?.name}/>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.amount")}:</span>
                <span className="text-sm font-bold">{formatCurrency(order.totalAmount!)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.status")}:</span>
                <Badge className={getOrderStatusColor(order.status!)} variant="secondary">
                  {getStatusText(order.status!)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.paymentStatus")}:</span>
                <Badge variant="outline" className="text-xs">
                  {t(`orders.paymentStatus.${order.paymentStatus}`)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
