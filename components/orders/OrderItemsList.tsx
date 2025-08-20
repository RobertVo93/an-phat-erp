import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency } from "@/lib/utils"
import { OrderItem } from "@/types"
import { X, Plus, Minus } from "lucide-react"
import React from "react"

interface OrderItemsListProps {
	orderItems: OrderItem[]
	updateQuantity: (index: number, quantity: number, stock: number) => void
	updatePrice: (index: number, price: number) => void
	removeItem: (index: number) => void
	getWarehouseProductTotal: (productId: string) => number
}

export const OrderItemsList = ({
	orderItems,
	updateQuantity,
	updatePrice,
	removeItem,
	getWarehouseProductTotal,
}: OrderItemsListProps) => {
	const { t } = useLanguage()

	return (
		<div className="space-y-3">
			{orderItems.map((item, index) => (
				<div key={item.product?.id} className="p-3 border rounded-lg space-y-3">
					<div className="flex items-start justify-between">
						<div className="flex-1 min-w-0">
							<p className="font-medium text-sm">{item.product!.name}</p>
							<p className="text-xs text-gray-500">SKU: {item.product?.sku}</p>
						</div>
						<Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-red-600 hover:text-red-700 ml-2">
							<X className="h-4 w-4" />
						</Button>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div className="space-y-1">
							<Label className="text-xs text-gray-500">{t("orders.quantity")}:</Label>
							<div className="flex items-center space-x-1">
								<Button type="button" variant="outline" size="sm" onClick={() => updateQuantity(index, item.quantity! - 1, getWarehouseProductTotal(item.product?.id!))} className="h-8 w-8 p-0">
									<Minus className="h-3 w-3" />
								</Button>
								<Input
									type="number"
									value={item.quantity}
									onChange={e => updateQuantity(index, Number.parseInt(e.target.value) || 1, getWarehouseProductTotal(item.product?.id!))}
									className="h-8 w-20 text-center text-xs"
									min="1"
									max={getWarehouseProductTotal(item.product?.id!)}
								/>
								<Button type="button" variant="outline" size="sm" onClick={() => updateQuantity(index, item.quantity! + 1, getWarehouseProductTotal(item.product?.id!))} className="h-8 w-8 p-0">
									<Plus className="h-3 w-3" />
								</Button>
							</div>
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-gray-500">{t("orders.stock")}:</Label>
							<Input readOnly value={getWarehouseProductTotal(item.product?.id!)} className="h-8 text-xs bg-gray-300 pointer-events-none w-20" />
						</div>
						<div className="space-y-1">
							<Label className="text-xs text-gray-500">{t("orders.price")}:</Label>
							<Input
								type="number"
								value={item.unitPrice}
								onChange={e => updatePrice(index, Number.parseFloat(e.target.value) || 0)}
								className="h-8 text-xs"
								step="0.01"
								min="0"
							/>
						</div>
					</div>
					<div className="flex justify-between items-center pt-2 border-t">
						<span className="text-sm font-medium">{t("orders.total")}:</span>
						<span className="text-sm font-bold">{formatLargeCurrency(item.total || 0, 2)}</span>
					</div>
				</div>
			))}
		</div>
	)
}
