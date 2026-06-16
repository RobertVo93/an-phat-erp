import { Label } from "@/components/ui/label"
import { FormattedNumber } from "@/components/ui/formatted-number"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { getProductionStatusColor } from "@/lib/utils"
import { Product, ProductionStatus } from "@/types"
import React from "react"

interface ProductionProductSelectorProps {
    selectedProduct: Product | undefined
    quantity: number
    availableProducts: Product[]
    errors: Record<string, string>
    isEditMode: boolean
    status: ProductionStatus
    setQuantity: (quantity: number) => void
    onSelectProduct: (productId: string) => void
    setStatus: (status: ProductionStatus) => void
}
export const ProductionProductSelector = ({ selectedProduct, quantity, setQuantity, availableProducts, onSelectProduct, errors, isEditMode, status, setStatus }: ProductionProductSelectorProps) => {
    const { t } = useLanguage()
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-${isEditMode ? "3" : "2"} gap-4`}>
            <div className="space-y-2 col-span-1">
                <Label htmlFor="product" className="text-sm">
                    {t("production.form.product")}
                </Label>
                <Select value={selectedProduct?.id} onValueChange={onSelectProduct}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder={t("production.form.selectProduct")} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableProducts.map((product: any) => (
                            <SelectItem key={product.id} value={product.id!}>
                                {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors?.selectedProduct && <p className="text-sm text-red-500">{errors.selectedProduct}</p>}
            </div>
            <div className="space-y-2 col-span-1">
                <Label htmlFor="quantity" className="text-sm">
                    {t("production.form.productionQuantity")}
                </Label>
                <FormattedNumber
                    as="input"
                    id="quantity"
                    placeholder={t("production.form.inputQuantity")}
                    value={quantity}
                    min={1}
                    onValueChange={(value) => setQuantity(value)}
                    className="h-10"
                />
                {errors?.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            </div>
            <div className="space-y-2 col-span-1" hidden={!isEditMode}>
                <Label htmlFor="status">{t("production.edit.status")}</Label>
                <Select
                    value={status}
                    onValueChange={(value: ProductionStatus) => setStatus(value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("production.edit.selectStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(ProductionStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${getProductionStatusColor(status)}`} />
                                    {t(`production.history.${status}`)}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
