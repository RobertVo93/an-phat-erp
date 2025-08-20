import { Calendar, MoreVertical } from "lucide-react"
import Link from "next/link"
import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatCurrency, formatDate, getOrderStatusColor } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { Order } from "@/types/order"

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
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="font-medium text-sm">{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDate(order.createdAt!)}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/orders/${order.id}`}>{t("common.view")}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.expectedDelivery")}:</span>
                <span className="text-sm font-medium text-red-500">{order.deliveryDate ? formatDate(order.deliveryDate) : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("orders.customer")}:</span>
                <span className="text-sm font-medium">{order.customer?.name}</span>
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
