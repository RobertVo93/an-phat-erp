import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import React from "react"

interface OrdersEmptyStateProps {
    onNewOrderClick: () => void
}

export const OrdersEmptyState: React.FC<OrdersEmptyStateProps> = ({ onNewOrderClick }) => {
    const { t } = useLanguage()
    return (
        <div className="text-center py-8 px-4">
            <p className="text-muted-foreground">{t("orders.noOrders")}</p>
            <Button variant="outline" className="mt-4" onClick={onNewOrderClick}>
                {t("orders.addFirstOrder")}
            </Button>
        </div>
    )
}