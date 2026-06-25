import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { formatCurrency, formatSystemNumber, groupWarehouseProductsByProduct } from "@/lib/utils"
import React, { useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { IOrderItem, Warehouse } from "@/types"
import { QuantitySelector } from "../quantity-selector"

interface OrderItemSelectorProps {
    selectedItems: IOrderItem[]
    addItem: () => void
    updateItem: (index: number, field: "id" | "quantity" | "unitCost", value: string | number) => void
    removeItem: (index: number) => void
    selectedWarehouse: Warehouse | undefined
}

export const OrderItemSelector = ({ selectedItems, addItem, updateItem, removeItem, selectedWarehouse }: OrderItemSelectorProps) => {
    const { t } = useLanguage()
    const groupWarehouseProducts = useMemo(() => groupWarehouseProductsByProduct(selectedWarehouse?.warehouseProducts || []), [selectedWarehouse])
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold">{t("common.products")}</h3>
                <Button variant="outline" size="sm" onClick={addItem} className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    {t("production.form.add")}
                </Button>
            </div>
            <div className="space-y-3">
                {selectedItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">{t("common.item")}</Label>
                                <Select value={item.id} onValueChange={(value) => updateItem(index, "id", value)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={t("production.form.select")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedWarehouse &&
                                            groupWarehouseProducts
                                                .filter((groupProduct) =>
                                                    groupProduct.product.id === item?.id ||
                                                    !selectedItems.some((selected, i) =>
                                                        i !== index && selected.id === groupProduct.product.id
                                                    )
                                                )
                                                .map((item, idx) => (
                                                    <SelectItem key={idx} value={item.product.id!}>
                                                        {item.product.name}
                                                    </SelectItem>
                                                ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("production.form.quantity")}</Label>
                                    <QuantitySelector
                                        quantity={item.quantity ?? 0}
                                        showAction={false}
                                        onQuantityChange={(newValue) => updateItem(index, "quantity", newValue)}
                                        className="h-9"
                                        inputClassName="text-left"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("production.form.unitCost")}</Label>
                                    <QuantitySelector
                                        quantity={item.unitCost ?? 0}
                                        showAction={false}
                                        onQuantityChange={(newValue) => updateItem(index, "unitCost", newValue)}
                                        className="h-9"
                                        inputClassName="text-left"
                                    />
                                </div>
                            </div>
                        </div>
                        {item?.id &&
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-gray-600">{t("production.form.unit")}: </span>
                                    <span className="font-medium">{t(`production.form.${item.unit}`)}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-gray-600">{t("production.detail.inStock")}: </span>
                                    <span className="font-medium">{formatSystemNumber(groupWarehouseProducts.find((record) => (record.product.id === item?.id))?.totalQuantity || 0)}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                                    <span className="font-medium">{formatCurrency(item.totalCost ?? 0)}</span>
                                </div>
                            </div>
                        }
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="w-full text-red-600 text-xs"
                        >
                            {t("production.form.remove")}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
