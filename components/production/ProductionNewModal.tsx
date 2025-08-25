import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { Employee, Product, Utility, Warehouse } from "@/types"
import { ProductionRecord } from "@/types/production"
import { ProductionForm } from "@/components/production/ProductionForm"

interface ProductionNewModalProps {
    isNewProductionOpen: boolean
    closeNewProduction: () => void
    createNewProduction: (data: ProductionRecord) => Promise<void>
    availableMaterials: Product[]
    availableProducts: Product[]
    availableUtilities: Utility[]
    availableEmployees: Employee[]
    availableWarehouses: Warehouse[]
    isLoading: boolean
}

export const ProductionNewModal = ({
    isNewProductionOpen,
    closeNewProduction,
    createNewProduction,
    availableMaterials,
    availableProducts,
    availableUtilities,
    availableEmployees,
    availableWarehouses,
    isLoading
}: ProductionNewModalProps) => {
    const { t } = useLanguage()

    return (
        <Dialog open={isNewProductionOpen} onOpenChange={closeNewProduction}>
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
                    onSubmit={createNewProduction}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}