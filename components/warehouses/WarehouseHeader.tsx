import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Plus } from "lucide-react"
import React from "react"

interface WarehouseHeaderProps {
    onCreateWarehouse: () => void
}

export const WarehouseHeader = ({ onCreateWarehouse }: WarehouseHeaderProps) => {
    const { t } = useLanguage()

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t("warehouse.title")}</h2>
                <p className="text-muted-foreground">{t("warehouse.description")}</p>
            </div>
            <Button onClick={onCreateWarehouse}>
                <Plus className="mr-2 h-4 w-4" />
                {t("warehouse.addWarehouse")}
            </Button>
        </div>
    )
}
