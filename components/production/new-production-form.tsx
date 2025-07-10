"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import type { ProductionRecord } from "@/types/production"
import { Employee, Product, ProductionStatus, Utility } from "@/types"
import { ProductionMaterial } from "@/types/productionMaterial"
import { useLanguage } from "@/contexts/language-context"
import { ProductionLabor } from "@/types/ProductionLabor"
import { ProductionUtility } from "@/types/productionUtility"

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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString("sv-SE"))
  const [selectedMaterials, setSelectedMaterials] = useState<ProductionMaterial[]>([])
  const [selectedUtilities, setSelectedUtilities] = useState<ProductionUtility[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<ProductionLabor[]>([])
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
      const addedUtility: Utility = {}
      setSelectedUtilities([
        ...selectedUtilities,
        addedUtility,
      ])
    }
  }

  const updateUtility = (index: number, field: string, value: any) => {
    const updated = [...selectedUtilities]
    if (field === "id") {
      const findUtility = availableUtilities.find((u) => u.id === value)
      if (findUtility) {
        updated[index] = {
          ...updated[index],
          id: findUtility.id,
          utility: findUtility,
          quantity: 1,
          totalCost: findUtility.costPerUnit
        }
      }
    } else if (field === "quantity") {
      updated[index][field] = Number.parseFloat(value) || 0
      updated[index].totalCost = updated[index].quantity! * updated[index].utility?.costPerUnit!
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
        updated[index] = {
          ...updated[index],
          id: employee.id,
          employee: employee,
          totalCost: employee.salary
        }
      }
    } else if (field === "totalCost") {
      updated[index].totalCost = Number.parseFloat(value) || 0
    }
    setSelectedEmployees(updated)
  }

  const removeEmployee = (index: number) => {
    setSelectedEmployees(selectedEmployees.filter((_, i) => i !== index))
  }

  const calculateTotalCost = () => {
    const materialsCost = selectedMaterials
      .filter((m) => typeof m?.totalCost === "number")
      .reduce((sum, m) => sum + m.totalCost!, 0);

    const utilitiesCost = selectedUtilities
      .filter((u) => typeof u?.totalCost === "number")
      .reduce((sum, u) => sum + u.totalCost!, 0);

    const laborCost = selectedEmployees
      .filter((e) => typeof e?.totalCost === "number")
      .reduce((sum, e) => sum + e.totalCost!, 0);

    return materialsCost + utilitiesCost + laborCost;
  };

  const calculateTotalProfit = () => {
    if (!selectedProduct || !quantity) return 0
    return selectedProduct?.price! * quantity - calculateTotalCost()
  }

  const calculateRevenue = () => {
    if (!selectedProduct || !quantity) return 0
    return selectedProduct?.price! * quantity
  }

  const calculateEfficiency = () => {
    const totalIncome = selectedProduct?.price! * quantity
    const efficiency = ((totalIncome! - calculateTotalCost()) / totalIncome!) * 100  // ((total income - total expense) / total income) * 100
    return efficiency
  }

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
      date: selectedDate,
      quantity: quantity,
      status: ProductionStatus.inProgress,
      shift: "",
      operator: "",
      product: selectedProduct!,
      productionMaterials: selectedMaterials,
      productionUtilities: selectedUtilities,
      productionLabors: selectedEmployees,
      totalCost: calculateTotalCost(),
    }

    createNewProduction(newProduction)
    onClose()
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Thông tin ngày sản xuất */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm">
            {t("production.form.productionDate")}
          </Label>
          <Input
            id="productionDate"
            type="date"
            className="h-11"
            value={ selectedDate ? selectedDate : "" }
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

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
              <div className="grid grid-cols-3 gap-2">
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
                    max={material.material?.stock}
                    value={material.quantity || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      const stock = material.material?.stock ?? Infinity;
                      // value in min-max range
                      if (!isNaN(value)) {
                        const clampedValue = Math.min(Math.max(value, 1), stock);
                        updateMaterial(index, "quantity", clampedValue);
                      } else {
                        updateMaterial(index, "quantity", "");
                      }
                    }}
                    className="h-9"
                  />
                </div>
                {material.material &&
                  <div className="space-y-1">
                    <Label className="text-xs">{t("production.form.inStock")}</Label>
                    <Input
                      value={material.material?.stock || 0}
                      readOnly
                      className="h-9 bg-slate-200 pointer-events-none"
                    />
                  </div>
                }
              </div>
              {material.material &&
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">{t("production.form.unit")}: </span>
                    <span className="font-medium">{t(`production.form.${material.material?.unit}`)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("production.form.unitPrice")}: </span>
                    <span className="font-medium">{material.material?.cost!.toLocaleString()} đ</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                    <span className="font-medium">{material.totalCost?.toLocaleString()} đ</span>
                  </div>
                </div>
              }
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
                  <Select value={utility.utility?.id} onValueChange={(value) => updateUtility(index, "id", value)}>
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
                        .map((util, ind) => (
                          <SelectItem key={ind} value={util.id!}>
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
              {utility.utility &&
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">{t("production.form.unit")}: </span>
                    <span className="font-medium">{utility.utility?.unit && t(`production.form.${utility.utility?.unit}`)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("production.form.unitPrice")}: </span>
                    <span className="font-medium">{utility.utility?.costPerUnit!.toLocaleString()} đ</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("production.form.totalCost")}: </span>
                    <span className="font-medium">{utility.totalCost ? utility.totalCost!.toLocaleString() : 0} đ</span>
                  </div>
                </div>
              }
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
          {selectedEmployees.map((selectedEmployee, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.employee")}</Label>
                  <Select value={selectedEmployee.employee?.id} onValueChange={(value) => updateEmployee(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={t("production.form.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmployees
                        .filter((emp) =>
                          emp.id === selectedEmployee?.id ||
                          !selectedEmployees.some((selected, i) =>
                            i !== index && selected?.id === emp.id
                          )
                        )
                        .map((emp, ind) => (
                          <SelectItem key={ind} value={emp.id!}>
                            {emp.name} - {emp.position}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("production.form.employeeSalary")}</Label>
                  <Input
                    placeholder="1"
                    type="number"
                    min={1}
                    value={selectedEmployee.totalCost || ""}
                    onChange={(e) => updateEmployee(index, "totalCost", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              {selectedEmployee.employee &&
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">{t("production.form.position")}: </span>
                    <span className="font-medium">{selectedEmployee.employee?.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t("production.form.wage")}: </span>
                    <span className="font-medium">{selectedEmployee.totalCost?.toLocaleString()} đ</span>
                  </div>
                </div>
              }
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
                {
                  selectedMaterials
                    .filter((e) => typeof e.totalCost === "number")
                    .reduce((sum, e) => sum + (e.totalCost ?? 0), 0)
                    .toLocaleString()
                } đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("production.form.utilityExpense")}:</span>
              <span className="font-medium">
                {
                  selectedUtilities
                    .filter((e) => typeof e.totalCost === "number")
                    .reduce((sum, e) => sum + (e.totalCost ?? 0), 0)
                    .toLocaleString()
                } đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("production.form.laborExpense")}:</span>
              <span className="font-medium">
                {
                  selectedEmployees
                    .filter((e) => typeof e.totalCost === "number")
                    .reduce((sum, e) => sum + (e.totalCost ?? 0), 0)
                    .toLocaleString()
                } đ
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>{t("production.form.totalExpense")}:</span>
              <span>{calculateTotalCost().toLocaleString()} đ</span>
            </div>
            {(selectedProduct && quantity) && (
              <div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{t("production.form.expensePerUnit")}:</span>
                  <span>
                    {(calculateTotalCost() / quantity).toLocaleString()} đ
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tổng kết lợi nhuận*/}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">{t("production.form.profitSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>{t("production.form.revenue")}:</span>
              <span>{calculateRevenue().toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>{t("production.form.totalProfit")}:</span>
              <span>{calculateTotalProfit().toLocaleString()} đ</span>
            </div>
            {(calculateTotalProfit() && calculateTotalCost()) ?
              <div className="flex justify-between text-xs text-gray-600">
                <span>{t("production.form.efficiency")}:</span>
                <span>
                  {calculateEfficiency().toFixed(2).toLocaleString()} %
                </span>
              </div> : null
            }
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
