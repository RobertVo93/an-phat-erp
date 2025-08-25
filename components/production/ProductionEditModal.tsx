import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { ProductionForm } from "./ProductionForm"
import { Employee, Product, Utility, Warehouse } from "@/types"
import { ProductionRecord } from "@/types/production"

interface ProductionEditModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: ProductionRecord) => Promise<void>
    availableMaterials: Product[]
    availableProducts: Product[]
    availableUtilities: Utility[]
    availableEmployees: Employee[]
    availableWarehouses: Warehouse[]
    isLoading: boolean
    record: ProductionRecord | null
}

export const ProductionEditModal = ({
    isOpen,
    onClose,
    onSave,
    availableMaterials,
    availableProducts,
    availableUtilities,
    availableEmployees,
    availableWarehouses,
    isLoading,
    record
}: ProductionEditModalProps) => {
    const { t } = useLanguage()
    if (!record) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("production.createNewProduction")}</DialogTitle>
                    <DialogDescription>
                        {t("production.createNewProductionDescription")}
                    </DialogDescription>
                </DialogHeader>
                <ProductionForm
                    materials={availableMaterials}
                    products={availableProducts}
                    uilities={availableUtilities}
                    employees={availableEmployees}
                    warehouses={availableWarehouses}
                    record={record}
                    isLoading={isLoading}
                    onSubmit={onSave}
                />
            </DialogContent>
        </Dialog>
    )
}