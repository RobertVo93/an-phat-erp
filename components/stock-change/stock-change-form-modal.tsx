"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { 
  StockChangeBasicInfoSection,
  StockChangeFormActions,
  StockChangeNotesSection,
  StockChangeProductsSection,
  StockChangeTotalsSection,
  IStockChangeFormModalProps,
  useStockChangeFormModal,
} from "./form-modal"

export function StockChangeFormModal(props: IStockChangeFormModalProps) {
  const { t } = useLanguage()
  const { isOpen, onClose, stockChange, products, warehouses, loading } = props
  const {
    formData,
    errors,
    setFormData,
    addProduct,
    updateItem,
    removeItem,
    handleStockTypeChange,
    handleWarehouseChange,
    handleSave,
  } = useStockChangeFormModal(props)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto bg-gradient-to-b from-background to-muted/30">
        <DialogHeader>
          <DialogTitle>{stockChange ? t("stockIn.form.title.edit") : t("stockIn.form.title.create")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <StockChangeBasicInfoSection
            formData={formData}
            errors={errors}
            warehouses={warehouses}
            setFormData={setFormData}
            onStockTypeChange={handleStockTypeChange}
            onWarehouseChange={handleWarehouseChange}
          />

          <StockChangeProductsSection
            stockProducts={formData.stockProducts || []}
            products={products}
            errors={errors}
            onAddProduct={addProduct}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />

          <StockChangeTotalsSection formData={formData} setFormData={setFormData} />
          <StockChangeNotesSection formData={formData} errors={errors} setFormData={setFormData} />
          <StockChangeFormActions status={formData.status} loading={loading} onClose={onClose} onSave={handleSave} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
