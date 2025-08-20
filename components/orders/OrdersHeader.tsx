import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Plus } from "lucide-react"
import React from "react"

interface OrdersHeaderProps {
	onNewOrderClick: () => void
}

export const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onNewOrderClick }) => {
	const { t } = useLanguage()
	return (
		<div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
			<div>
				<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("orders.title")}</h2>
				<p className="text-muted-foreground text-sm sm:text-base">{t("orders.description")}</p>
			</div>
			<Button onClick={onNewOrderClick} className="w-full sm:w-auto">
				<Plus className="mr-2 h-4 w-4" />
				{t("orders.newOrder")}
			</Button>
		</div>
	)
}
