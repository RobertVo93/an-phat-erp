"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { SelectedUtility, ProductionRecord } from "@/types/production"
import { Employee, Product, ProductionStatus, Utility } from "@/types"
import { formatLocalDatetime } from "@/lib/utils"
import { ProductionMaterial } from "@/types/productionMaterial"
import { useLanguage } from "@/contexts/language-context"

interface NewProductionFormProps {
  availableProducts: Product[]
  availableMaterials: Product[]
  availableUtilities: Utility[]
  availableEmployees: Employee[]
  onClose: () => void
  createNewProduction: (data: ProductionRecord) => void
}

export function NewProductionForm({
  availableProducts,
  availableMaterials,
  availableUtilities,
  availableEmployees,
  onClose,
  createNewProduction
}: NewProductionFormProps) {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedMaterials, setSelectedMaterials] = useState<ProductionMaterial[]>([])
  const [selectedUtilities, setSelectedUtilities] = useState<SelectedUtility[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addMaterial = () => {
    if (selectedMaterials.length < availableMaterials.length) {
      const addedMaterial: Product = {}
      setSelectedMaterials([
        ...selectedMaterials,
        addedMaterial,
      ])
    }
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...selectedMaterials]
    if (field === "id") {
      const material = availableMaterials.find((m) => m.id === value)
      if (material) {
        updated[index] = {
          ...updated[index],
          id: material.id,
          material: material,
          quantity: 1,
          totalCost: material.cost,
        }
      }
    } else if (field === "quantity") {
      updated[index][field] = Number.parseFloat(value) || 0
      updated[index].totalCost = updated[index].quantity! * updated[index].material?.cost!
    }
    setSelectedMaterials(updated)
  }

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index))
  }

  const addUtility = () => {
    if (selectedUtilities.length < availableUtilities.length) {
      setSelectedUtilities([
        ...selectedUtilities,
        {
          id: "",
          name: "",
          quantity: 0,
          unit: "",
          cost: 0,
          totalCost: 0,
        },
      ])
    }
  }

  const updateUtility = (index: number, field: string, value: any) => {
    const updated = [...selectedUtilities]
    if (field === "id") {
      const utility = availableUtilities.find((u) => u.id === value)
      if (utility) {
        updated[index] = {
          ...updated[index],
          id: utility.id,
          name: utility.name,
          unit: utility.unit,
          quantity: 1,
          cost: utility.costPerUnit,
          totalCost: updated[index].quantity! * utility.costPerUnit!,
        }
      }
    } else if (field === "quantity") {
      updated[index][field] = Number.parseFloat(value) || 0
      updated[index].totalCost = updated[index].quantity! * updated[index].cost!
    }
    setSelectedUtilities(updated)
  }

  const removeUtility = (index: number) => {
    setSelectedUtilities(selectedUtilities.filter((_, i) => i !== index))
  }

  const addEmployee = () => {
    if (selectedEmployees.length < availableEmployees.length) {
      setSelectedEmployees([
        ...selectedEmployees,
        {},
      ])
    }
  }

  const updateEmployee = (index: number, field: string, value: any) => {
    const updated = [...selectedEmployees]
    if (field === "id") {
      const employee = availableEmployees.find((e) => e.id === value)
      if (employee) {
        updated[index] = employee
      }
    }
    setSelectedEmployees(updated)
  }

  const removeEmployee = (index: number) => {
    setSelectedEmployees(selectedEmployees.filter((_, i) => i !== index))
  }

  const calculateTotalCost = () => {
    const materialsCost = selectedMaterials.reduce(
      (sum, m) => sum + (typeof m?.totalCost === "number" ? m.totalCost : 0), 0);

    const utilitiesCost = selectedUtilities.reduce(
      (sum, u) => sum + (typeof u?.totalCost === "number" ? u.totalCost : 0), 0);

    const laborCost = selectedEmployees.reduce(
      (sum, e) => sum + (typeof e?.salary === "number" ? e.salary : 0), 0);

    return materialsCost + utilitiesCost + laborCost;
  };

  const onSelectProduct = (id: string) => {
    const selectingProduct = availableProducts.find((pro) => pro.id === id)
    setSelectedProduct(selectingProduct!)
  }

  function hasValidArray(arr: any) {
    return Array.isArray(arr) &&
      arr.length > 0 &&
      arr.every(item => item && typeof item.id === "string" && item.id.trim() !== "");
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedProduct) {
      newErrors.selectedProduct = t("production.form.selectedProductRequired")
    }
    if (quantity === 0) {
      newErrors.quantity = t("production.form.quantityMustGreaterThanZero")
    }
    if (!hasValidArray(selectedMaterials)) {
      newErrors.selectedMaterials = t("production.form.selectedMaterialsRequired")
    }
    if (!hasValidArray(selectedUtilities)) {
      newErrors.selectedUtilities = t("production.form.selectedUtilitiesRequired")
    }
    if (!hasValidArray(selectedEmployees)) {
      newErrors.selectedEmployees = t("production.form.selectedEmployeesRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    const newProduction: ProductionRecord = {
      date: formatLocalDatetime(new Date()),
      quantity: quantity,
      unit: "",
      status: ProductionStatus.inProgress,
      shift: "",
      operator: "",
      product: selectedProduct!,
      productionMaterials: selectedMaterials,
      productionUtilities: selectedUtilities,
      productionLabors: selectedEmployees,
      totalCost: calculateTotalCost(),
      efficiency: 0,
    }

    createNewProduction(newProduction)
    onClose()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Thông tin sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm">
            {t("production.form.product")}
          </Label>
          <Select value={selectedProduct?.id} onValueChange={onSelectProduct}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t("production.form.selectProduct")} />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.id} value={product.id!}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.selectedProduct && <p className="text-sm text-red-500">{errors.selectedProduct}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm">
            {t("production.form.productionQuantity")}
          </Label>
          <Input
            id="quantity"
            placeholder={t("production.form.inputQuantity")}
            value={quantity}
            type="number"
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-10"
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
        </div>
      </div>

      {/* Nguyên liệu */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">{t("production.form.materials")}</h3>
          <Button variant="outline" size="sm" onClick={addMaterial} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            {t("production.form.add")}
          </Button>
        </div>
        <div className="space-y-3">
          {selectedMaterials.map((material, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.materials")}</Label>
                  <Select value={material.id} onValueChange={(value) => updateMaterial(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t("production.form.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMaterials
                        .filter((mat) =>
                          mat.id === material.material?.id ||
                          !selectedMaterials.some((selected, i) =>
                            i !== index && selected.material?.id === mat.id
                          )
                        )
                        .map((mat) => (
                          <SelectItem key={mat.id} value={mat.id!}>
                            {mat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.quantity")}</Label>
                  <Input
                    placeholder="1"
                    type="number"
                    min={1}
                    value={material.quantity || ""}
                    onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* <div>
                  <span className="text-gray-600">Đơn vị: </span>
                  <span className="font-medium">{material.unit}</span>
                </div> */}
                <div>
                  <span className="text-gray-600">{t("production.form.unitPrice")}: </span>
                  <span className="font-medium">{material.material?.cost!.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                  <span className="font-medium">{material.totalCost}</span>
                </div>
              </div>
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
          {errors.selectedMaterials && <p className="text-sm text-red-500">{errors.selectedMaterials}</p>}
        </div>
      </div>

      {/* Tiện ích */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">{t("production.form.utility")}</h3>
          <Button variant="outline" size="sm" onClick={addUtility} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            {t("production.form.add")}
          </Button>
        </div>
        <div className="space-y-3">
          {selectedUtilities.map((utility, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.utility")}</Label>
                  <Select value={utility.id} onValueChange={(value) => updateUtility(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t("production.form.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUtilities
                        .filter((util) =>
                          util.id === utility.id ||
                          !selectedUtilities.some((selected, i) =>
                            i !== index && selected?.id === util.id
                          )
                        )
                        .map((util) => (
                          <SelectItem key={util.id} value={util.id!}>
                            {util.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.quantity")}</Label>
                  <Input
                    placeholder="1"
                    type="number"
                    min={1}
                    value={utility.quantity || ""}
                    onChange={(e) => updateUtility(index, "quantity", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">{t("production.form.unit")}: </span>
                  <span className="font-medium">{utility.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("production.form.unitPrice")}: </span>
                  <span className="font-medium">{utility.cost!.toString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                  <span className="font-medium">{utility.totalCost!.toString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeUtility(index)}
                className="w-full text-red-600 text-xs"
              >
                {t("production.form.remove")}
              </Button>
            </div>
          ))}
        </div>
        {errors.selectedUtilities && <p className="text-sm text-red-500">{errors.selectedUtilities}</p>}
      </div>

      {/* Nhân công */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">{t("production.form.labor")}</h3>
          <Button variant="outline" size="sm" onClick={addEmployee} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            {t("production.form.add")}
          </Button>
        </div>
        <div className="space-y-3">
          {selectedEmployees.map((employee, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.employee")}</Label>
                  <Select value={employee.id} onValueChange={(value) => updateEmployee(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t("production.form.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmployees
                        .filter((emp) =>
                          emp.id === employee?.id ||
                          !selectedEmployees.some((selected, i) =>
                            i !== index && selected?.id === emp.id
                          )
                        )
                        .map((emp) => (
                          <SelectItem key={emp.id} value={emp.id!}>
                            {emp.name} - {emp.position}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">{t("production.form.position")}: </span>
                  <span className="font-medium">{employee.position}</span>
                </div>
                <div>
                  <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                  <span className="font-medium">{employee.salary?.toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEmployee(index)}
                className="w-full text-red-600 text-xs"
              >
                {t("production.form.remove")}
              </Button>
            </div>
          ))}
        </div>
        {errors.selectedEmployees && <p className="text-sm text-red-500">{errors.selectedEmployees}</p>}
      </div>

      {/* Tổng kết chi phí */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">{t("production.form.expensesSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("production.form.materialExpense")}:</span>
              <span className="font-medium">
                {selectedMaterials.reduce((sum, m) => sum + (m.totalCost ?? 0), 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("production.form.utilityExpense")}:</span>
              <span className="font-medium">
                {selectedUtilities.reduce((sum, u) => sum + u.totalCost!, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("production.form.laborExpense")}:</span>
              {/* <span className="font-medium">
                {selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0).toLocaleString()} đ
              </span> */}
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>{t("production.form.totalExpense")}:</span>
              <span>{calculateTotalCost().toLocaleString()}</span>
            </div>
            {quantity && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>{t("production.form.expensePerUnit")}:</span>
                {/* <span>
                  {(calculateTotalCost() / quantity).toFixed(0).toLocaleString()} đ/
                  {availableProducts.find((p) => p.id === selectedProduct)?.unit || "đơn vị"}
                </span> */}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          {t("production.form.cancel")}
        </Button>
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          {t("production.form.saveProductionSheet")}
        </Button>
      </div>
    </div>
  )
}
