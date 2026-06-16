"use client"

import { useLanguage } from "@/contexts/language-context"
import { ProductionDateWarehouseSelector } from "@/components/production/ProductionDateWarehouseSelector"
import { ProductionProductSelector } from "@/components/production/ProductionProductSelector"
import { ProductionMaterials } from "@/components/production/ProductionMaterials"
import { ProductionUtilities } from "@/components/production/ProductionUtilities"
import { ProductionLabors } from "@/components/production/ProductionLabors"
import { ProductionExpensesSummary } from "@/components/production/ProductionExpensesSummary"
import { ProductionProfitSummary } from "@/components/production/ProductionProfitSummary"
import { ProductionFormActions } from "@/components/production/ProductionFormActions"
import { ProductionRecord } from "@/types/production"
import { Employee, Product, Warehouse, Utility } from "@/types"
import { useProductionForm } from "@/hooks/use-production-form"

interface ProductionFormProps {
  products: Product[]
  materials: Product[]
  uilities: Utility[]
  employees: Employee[]
  warehouses: Warehouse[]
  record?: ProductionRecord | undefined
  isLoading: boolean
  onSubmit: (data: ProductionRecord) => Promise<void>
}

export function ProductionForm(props: ProductionFormProps) {
  const { t } = useLanguage()
  const {
    availableProducts,
    availableUtilities,
    availableEmployees,
    availableWarehouses,
    formData,
    errors,
    addMaterial,
    updateMaterial,
    removeMaterial,
    addUtility,
    updateUtility,
    removeUtility,
    addEmployee,
    updateEmployee,
    removeEmployee,
    calculateTotalCost,
    calculateTotalProfit,
    calculateRevenue,
    calculateEfficiency,
    onSelectProduct,
    handleSubmit,
    setFormData,
  } = useProductionForm(
    props.products,
    props.materials,
    props.uilities,
    props.employees,
    props.warehouses,
    props.record,
    props.onSubmit,
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProductionDateWarehouseSelector
        selectedDate={formData.date!}
        setSelectedDate={(date) => setFormData({ ...formData, date })}
        selectedWarehouse={formData.warehouse}
        setSelectedWarehouse={(warehouse) => setFormData({ ...formData, warehouse })}
        availableWarehouses={availableWarehouses}
        error={errors.selectedWarehouse}
      />
      <ProductionProductSelector
        selectedProduct={formData.product}
        quantity={formData.quantity!}
        setQuantity={(quantity) => setFormData({ ...formData, quantity })}
        availableProducts={availableProducts}
        onSelectProduct={onSelectProduct}
        errors={errors}
        isEditMode={!!props.record}
        status={formData.status!}
        setStatus={(status) => setFormData({ ...formData, status })}
      />
      <ProductionMaterials
        selectedMaterials={formData.materials || []}
        addMaterial={addMaterial}
        updateMaterial={updateMaterial}
        removeMaterial={removeMaterial}
        selectedWarehouse={formData.warehouse}
        error={errors}
      />
      <ProductionUtilities
        selectedUtilities={formData.utilities || []}
        addUtility={addUtility}
        updateUtility={updateUtility}
        removeUtility={removeUtility}
        availableUtilities={availableUtilities}
        error={errors.selectedUtilities}
      />
      <ProductionLabors
        selectedEmployees={formData.labors || []}
        addEmployee={addEmployee}
        updateEmployee={updateEmployee}
        removeEmployee={removeEmployee}
        availableEmployees={availableEmployees}
        error={errors.selectedEmployees}
      />
      <ProductionExpensesSummary
        selectedMaterials={formData.materials || []}
        selectedUtilities={formData.utilities || []}
        selectedEmployees={formData.labors || []}
        calculateTotalCost={calculateTotalCost}
        quantity={formData.quantity!}
      />
      <ProductionProfitSummary
        calculateTotalCost={calculateTotalCost}
        calculateTotalProfit={calculateTotalProfit}
        calculateRevenue={calculateRevenue}
        calculateEfficiency={calculateEfficiency}
      />
      <ProductionFormActions
        onSubmit={() => handleSubmit(t)}
        isLoading={props.isLoading}
      />
    </div>
  )
}
