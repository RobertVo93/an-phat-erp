import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { formatCurrency, formatSystemNumber, groupWarehouseProductsByProduct } from "@/lib/utils"
import React, { useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { IProductionElement } from "@/types/production"
import { Warehouse } from "@/types"
import { QuantitySelector } from "../common/quantity-selector"

interface ProductionMaterialsProps {
    selectedMaterials: IProductionElement[]
    addMaterial: () => void
    updateMaterial: (index: number, field: string, value: any) => void
    removeMaterial: (index: number) => void
    selectedWarehouse: Warehouse | undefined
    error: Record<string, string>
}

export const ProductionMaterials = ({ selectedMaterials, addMaterial, updateMaterial, removeMaterial, selectedWarehouse, error }: ProductionMaterialsProps) => {
    const { t } = useLanguage()
    const groupWarehouseProducts = useMemo(() => groupWarehouseProductsByProduct(selectedWarehouse?.warehouseProducts || []), [selectedWarehouse])
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold">{t("production.form.materials")}</h3>
                {selectedWarehouse ? <Button variant="outline" size="sm" onClick={addMaterial} className="text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    {t("production.form.add")}
                </Button> :
                    <div>{t("production.form.selectWarehouseFirst")}</div>
                }
            </div>
            <div className="space-y-3">
                {selectedMaterials.map((material, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <Label className="text-xs">{t("production.form.materials")}</Label>
                                <Select value={material.id} onValueChange={(value) => updateMaterial(index, "id", value)}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue placeholder={t("production.form.select")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedWarehouse &&
                                            groupWarehouseProducts
                                                .filter((groupProduct) =>
                                                    groupProduct.product.id === material?.id ||
                                                    !selectedMaterials.some((selected, i) =>
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
                                        quantity={material.quantity ?? 0}
                                        showAction={false}
                                        onQuantityChange={(newValue) => updateMaterial(index, "quantity", newValue)}
                                        className="h-9"
                                        inputClassName="text-left"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">{t("production.form.unitCost")}</Label>
                                    <QuantitySelector
                                        quantity={material.unitCost ?? 0}
                                        showAction={false}
                                        onQuantityChange={(newValue) => updateMaterial(index, "unitCost", newValue)}
                                        className="h-9"
                                        inputClassName="text-left"
                                    />
                                </div>
                            </div>
                        </div>
                        {material?.id &&
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-gray-600">{t("production.form.unit")}: </span>
                                    <span className="font-medium">{t(`production.form.${material.unit}`)}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-gray-600">{t("production.detail.inStock")}: </span>
                                    <span className="font-medium">{formatSystemNumber(groupWarehouseProducts.find((item) => (item.product.id === material?.id))?.totalQuantity || 0)}</span>
                                </div>
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                                    <span className="font-medium">{formatCurrency(material.totalCost ?? 0)}</span>
                                </div>
                            </div>
                        }
                        {error?.[`materials_${index}`] && <p className="text-sm text-red-500">{error[`materials_${index}`]}</p>}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMaterial(index)}
                            className="w-full text-red-600 text-xs"
                        >
                            {t("production.form.remove")}
                        </Button>
                    </div>
                ))}
                {error?.selectedMaterials && <p className="text-sm text-red-500">{error.selectedMaterials}</p>}
            </div>
        </div>
    )
}
