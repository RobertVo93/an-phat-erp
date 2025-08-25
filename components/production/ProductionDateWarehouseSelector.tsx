import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Warehouse } from "@/types"
import { formatYYYYMMDD } from "@/lib/utils"
import React from "react"

interface ProductionDateWarehouseSelectorProps {
    selectedDate: Date
    selectedWarehouse: Warehouse | undefined
    availableWarehouses: Warehouse[]
    error: string
    setSelectedWarehouse: (warehouse: Warehouse) => void
    setSelectedDate: (date: Date) => void
}
export const ProductionDateWarehouseSelector = ({
    selectedDate,
    selectedWarehouse,
    availableWarehouses,
    error,
    setSelectedDate,
    setSelectedWarehouse,
}: ProductionDateWarehouseSelectorProps) => {
    const { t } = useLanguage()
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="productionDate" className="text-sm">
                    {t("production.form.productionDate")}
                </Label>
                <Input
                    id="productionDate"
                    type="date"
                    className="h-11"
                    value={formatYYYYMMDD(selectedDate)}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="warehouse" className="text-sm">
                    {t("production.form.warehouse")}
                </Label>
                <Select
                    value={selectedWarehouse?.id}
                    onValueChange={(value: string) => setSelectedWarehouse(availableWarehouses.find((wh) => wh.id === value)!)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("production.form.selectWarehouse")} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableWarehouses.map((wh: any, ind: number) => (
                            <SelectItem value={wh.id!} key={ind}>{wh.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </div>
    )
}