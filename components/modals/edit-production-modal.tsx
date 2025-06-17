"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Product, ProductionStatus } from "@/types"
import { availableEmployees, availableUtilities } from "@/lib/production-data"
import { ProductionMaterial } from "@/types/productionMaterial"
import { ProductionRecord, SelectedEmployee, SelectedUtility } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"

interface EditProductionModalProps {
  isOpen: boolean
  availableMaterials: Product[]
  availableProducts: Product[]
  onClose: () => void
  record: ProductionRecord
  onSave: (updatedRecord: any) => void
}

export function EditProductionModal({
  availableMaterials,
  availableProducts,
  isOpen,
  onClose,
  record,
  onSave
}: EditProductionModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<ProductionRecord | null>(record)
  const [selectedMaterials, setSelectedMaterials] = useState<ProductionMaterial[]>([])
  const [selectedUtilities, setSelectedUtilities] = useState<SelectedUtility[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([])

  const statusOptions = [
    { value: "in-progress", label: t("production.edit.in-progress"), color: "bg-yellow-100 text-yellow-800" },
    { value: "completed", label: t("production.edit.completed"), color: "bg-green-100 text-green-800" },
    { value: "paused", label: t("production.edit.paused"), color: "bg-orange-100 text-orange-800" },
    { value: "cancelled", label: t("production.edit.cancelled"), color: "bg-red-100 text-red-800" },
  ]

  const shiftOptions = [
    { value: "morning", label: "Ca Sáng (6:00 - 14:00)" },
    { value: "afternoon", label: "Ca Chiều (14:00 - 22:00)" },
    { value: "night", label: "Ca Đêm (22:00 - 6:00)" },
  ]

  // Load dữ liệu từ record khi modal mở
  useEffect(() => {
    if (record && isOpen) {
      setFormData(record)

      // Load materials
      setSelectedMaterials(record.productionMaterials!)

      // Load utilities
      const selectedUtilities = availableUtilities
        .filter((utility) =>
          record.utilities?.some((u) => u.name === utility.name)
        )
        .map((utility) => {
          const matched = record.utilities?.find((u) => u.name === utility.name);
          return {
            ...utility,
            quantity: matched?.quantity ?? 0,
            cost: matched?.cost ?? utility.cost,
            totalCost: (matched?.quantity ?? 0) * (matched?.cost! ?? utility.cost!),
          };
        }) as SelectedUtility[];
      setSelectedUtilities(selectedUtilities)

      // Load employees (giả sử có thông tin nhân viên)
      const employees: SelectedEmployee[] = [
        {
          id: "emp001",
          name: "record.operator",
          position: "Trưởng ca",
          hours: record.labor?.hours!,
          hourlyRate: record.labor?.cost! / record.labor?.hours!,
          totalCost: record.labor?.cost!,
        },
      ]
      setSelectedEmployees(employees)
    }
  }, [record, isOpen])

  // Helper functions
  const getProductIdByName = (name: string) => {
    const product = availableProducts.find((p) => p.name === name)
    return product?.id || ""
  }

  const getMaterialIdByName = (name: string) => {
    const material = availableMaterials.find((m) => m.name === name)
    return material?.id || ""
  }

  const getUtilityIdByName = (name: string) => {
    const utility = availableUtilities.find((u) => u.name === name)
    return utility?.id || ""
  }

  const getShiftValueByText = (shiftText: string) => {
    if (shiftText.includes("Sáng")) return "morning"
    if (shiftText.includes("Chiều")) return "afternoon"
    if (shiftText.includes("Đêm")) return "night"
    return "morning"
  }

  // Material functions
  const addMaterial = () => {
    const addedMaterial: ProductionMaterial = {
      id: "",
      quantity: 0,
      totalCost: 0,
      material: undefined,
      production: undefined,
    }

    setSelectedMaterials([
      ...selectedMaterials,
      addedMaterial,
    ])
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...selectedMaterials]
    if (field === "id") {
      const material = availableMaterials.find((m) => m.id === value)
      if (material) {
        updated[index] = {
          ...updated[index],
          id: material.id!,
          material: material!,
          quantity: 1,
          totalCost: material.cost!,
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

  // Utility functions
  const addUtility = () => {
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
          cost: utility.cost,
          totalCost: updated[index].quantity! * utility.cost!,
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

  // Employee functions
  const addEmployee = () => {
    setSelectedEmployees([
      ...selectedEmployees,
      {
        id: "",
        name: "",
        position: "",
        hours: 0,
        hourlyRate: 0,
        totalCost: 0,
      },
    ])
  }

  const updateEmployee = (index: number, field: string, value: any) => {
    const updated = [...selectedEmployees]
    if (field === "id") {
      const employee = availableEmployees.find((e) => e.id === value)
      if (employee) {
        updated[index] = {
          ...updated[index],
          id: employee.id,
          name: employee.name,
          position: employee.position,
          hourlyRate: employee.hourlyRate,
          totalCost: updated[index].hours * employee.hourlyRate,
        }
      }
    } else if (field === "hours") {
      updated[index][field] = Number.parseFloat(value) || 0
      updated[index].totalCost = updated[index].hours * updated[index].hourlyRate
    }
    setSelectedEmployees(updated)
  }

  const removeEmployee = (index: number) => {
    setSelectedEmployees(selectedEmployees.filter((_, i) => i !== index))
  }

  const calculateTotalCost = () => {
    const materialsCost = selectedMaterials.reduce((sum, m) => sum + m.totalCost!, 0)
    const utilitiesCost = selectedUtilities.reduce((sum, u) => sum + u.totalCost!, 0)
    const laborCost = selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0)
    return materialsCost + utilitiesCost + laborCost
  }

  const handleSave = () => {
    const updatedRecord = {
      ...record,
      product: formData?.product,
      quantity: Number(formData?.quantity),
      status: formData?.status,
      statusText: t(`production.edit.${record.status}`),
      shift: shiftOptions.find((s) => s.value === formData?.shift)?.label.split(" ")[1] || record.shift,
      operator: formData?.operator,
      date: formData?.date,
      efficiency: Number(formData?.efficiency),
      productionMaterials: selectedMaterials,
      utilities: selectedUtilities.map((u) => ({
        name: u.name,
        quantity: u.quantity,
        unit: u.unit,
        cost: u.totalCost,
      })),
      labor: {
        hours: selectedEmployees.reduce((sum, e) => sum + e.hours, 0),
        workers: selectedEmployees.length,
        cost: selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0),
      },
      totalCost: calculateTotalCost(),
    }
    onSave(updatedRecord)
    onClose()
  }

  const currentStatus = formData?.status ? statusOptions.find((s) => s.value === formData?.status?.toString()) : ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {t("production.edit.title")} - {formData?.productionNumber}
            {currentStatus && <Badge className={currentStatus.color}>{currentStatus.label}</Badge>}
          </DialogTitle>
          <DialogDescription>{t("production.edit.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("production.edit.basicInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">{t("production.edit.products")}</Label>
                  <Select
                    value={formData?.product?.id}
                    onValueChange={(value) => setFormData({ ...formData, product: availableProducts.find(item => item.id === value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("production.edit.selectProduct")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id!}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("production.edit.quantity")}</Label>
                  <Input
                    id="quantity"
                    type="number"

                    value={formData?.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    placeholder={t("production.edit.inputQuantity")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t("production.edit.status")}</Label>
                  <Select
                    value={formData?.status}
                    onValueChange={(value: ProductionStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("production.edit.selectStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.color.split(" ")[0]}`} />
                            {status.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shift">{t("production.edit.workingShift")}</Label>
                  <Select value={formData?.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("production.edit.selectShift")} />
                    </SelectTrigger>
                    <SelectContent>
                      {shiftOptions.map((shift) => (
                        <SelectItem key={shift.value} value={shift.value}>
                          {shift.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operator">{t("production.edit.operator")}</Label>
                  <Input
                    id="operator"
                    value={formData?.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    placeholder={t("production.edit.operator")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency">{t("production.edit.efficiency")} (%)</Label>
                  <Input
                    id="efficiency"
                    type="number"
                    value={formData?.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: Number(e.target.value) })}
                    placeholder={t("production.edit.efficiency")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nguyên liệu */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("production.edit.usedMaterials")}</CardTitle>
                <Button variant="outline" size="sm" onClick={addMaterial}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t("production.edit.addMaterial")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedMaterials.map((material, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.materials")}</Label>
                        <Select
                          value={material.material?.id ?? ""}
                          onValueChange={(value) => updateMaterial(index, "id", value)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder={t("production.edit.select")} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMaterials.map((mat) => (
                              <SelectItem key={mat.id!} value={mat.id!}>
                                {mat.name!}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.quantity")}</Label>
                        <Input
                          placeholder="0"
                          type="number"
                          value={material.quantity ?? 0}
                          onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.unitPrice")}</Label>
                        <Input
                          value={material.material?.cost?.toLocaleString() ?? ""}
                          disabled
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.totalCost")}</Label>
                        <Input
                          value={material.totalCost?.toLocaleString() ?? ""}
                          disabled
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs opacity-0">{t("production.edit.action")}</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                          className="h-9 w-full text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tiện ích */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("production.edit.usedUtility")}</CardTitle>
                <Button variant="outline" size="sm" onClick={addUtility}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t("production.edit.addUtility")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedUtilities.map((utility, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Tiện ích</Label>
                        <Select value={utility.id} onValueChange={(value) => updateUtility(index, "id", value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder={t("production.edit.select")} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUtilities.map((util) => (
                              <SelectItem key={util.id} value={util.id!}>
                                {util.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.quantity")}</Label>
                        <Input
                          placeholder="0"
                          value={utility.quantity || ""}
                          onChange={(e) => updateUtility(index, "quantity", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.unit")}</Label>
                        <Input value={utility.unit} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.unitPrice")}</Label>
                        <Input value={utility.cost!.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.totalCost")}</Label>
                        <Input value={utility.totalCost?.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs opacity-0">Action</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeUtility(index)}
                          className="h-9 w-full text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nhân công */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("production.edit.labor")}</CardTitle>
                <Button variant="outline" size="sm" onClick={addEmployee}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t("production.edit.addEmployee")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedEmployees.map((employee, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                      <div className="space-y-1 lg:col-span-2">
                        <Label className="text-xs">{t("production.edit.employee")}</Label>
                        <Select value={employee.id} onValueChange={(value) => updateEmployee(index, "id", value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder={t("production.edit.selectEmployee")} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableEmployees.map((emp) => (
                              <SelectItem key={emp.id} value={emp.id}>
                                <div className="flex items-center gap-2">
                                  <img
                                    src={emp.avatar || "/placeholder.svg"}
                                    alt={emp.name}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div>
                                    <div className="font-medium text-sm">{emp.name}</div>
                                    <div className="text-xs text-gray-500">{emp.position}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.position")}</Label>
                        <Input value={employee.position} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.hours")}</Label>
                        <Input
                          placeholder="0"
                          value={employee.hours || ""}
                          onChange={(e) => updateEmployee(index, "hours", e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.salaryPerHour")}</Label>
                        <Input value={employee.hourlyRate.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("production.edit.totalCost")}</Label>
                        <div className="flex gap-1">
                          <Input value={employee.totalCost.toLocaleString()} disabled className="h-9" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeEmployee(index)}
                            className="h-9 px-2 text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tổng kết chi phí */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("production.edit.expensesSummary")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedMaterials.reduce((sum, m) => sum + m.totalCost!, 0).toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">{t("production.edit.materialExpense")}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedUtilities.reduce((sum, u) => sum + u.cost!, 0).toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">{t("production.edit.utilityExpense")}</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0).toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">{t("production.edit.laborExpense")}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{calculateTotalCost().toLocaleString()} đ</div>
                  <div className="text-sm text-gray-600">{t("production.edit.totalExpense")}</div>
                </div>
              </div>
              {formData?.quantity && (
                <div className="mt-4 text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">
                    {t("production.edit.expensePerUnit")}:{" "}
                    {(calculateTotalCost() / Number(formData?.quantity)).toFixed(0).toLocaleString()} đ/
                    {/* {availableProducts.find((p) => p.id === formData?.product)?.unit || "đơn vị"} */}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="w-4 h-4 mr-2" />
            {t("production.edit.cancel")}
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            {t("production.edit.saveChange")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
