"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { availableProducts, availableMaterials, availableUtilities, availableEmployees } from "@/lib/production-data"
import type { SelectedMaterial, SelectedUtility, SelectedEmployee } from "@/types/production"

interface NewProductionFormProps {
  onClose: () => void
}

export function NewProductionForm({ onClose }: NewProductionFormProps) {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("")
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([])
  const [selectedUtilities, setSelectedUtilities] = useState<SelectedUtility[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([])

  const addMaterial = () => {
    setSelectedMaterials([
      ...selectedMaterials,
      {
        id: "",
        name: "",
        quantity: 0,
        unit: "",
        price: 0,
        totalCost: 0,
      },
    ])
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const updated = [...selectedMaterials]
    if (field === "id") {
      const material = availableMaterials.find((m) => m.id === value)
      if (material) {
        updated[index] = {
          ...updated[index],
          id: material.id,
          name: material.name,
          unit: material.unit,
          price: material.price,
          totalCost: updated[index].quantity * material.price,
        }
      }
    } else if (field === "quantity") {
      updated[index][field] = Number.parseFloat(value) || 0
      updated[index].totalCost = updated[index].quantity * updated[index].price
    } else {
      updated[index][field] = value
    }
    setSelectedMaterials(updated)
  }

  const removeMaterial = (index: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== index))
  }

  const addUtility = () => {
    setSelectedUtilities([
      ...selectedUtilities,
      {
        id: "",
        name: "",
        quantity: 0,
        unit: "",
        price: 0,
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
          price: utility.price,
          totalCost: updated[index].quantity * utility.price,
        }
      }
    } else if (field === "quantity") {
      updated[index][field] = Number.parseFloat(value) || 0
      updated[index].totalCost = updated[index].quantity * updated[index].price
    } else {
      updated[index][field] = value
    }
    setSelectedUtilities(updated)
  }

  const removeUtility = (index: number) => {
    setSelectedUtilities(selectedUtilities.filter((_, i) => i !== index))
  }

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
    } else {
      updated[index][field] = value
    }
    setSelectedEmployees(updated)
  }

  const removeEmployee = (index: number) => {
    setSelectedEmployees(selectedEmployees.filter((_, i) => i !== index))
  }

  const calculateTotalCost = () => {
    const materialsCost = selectedMaterials.reduce((sum, m) => sum + m.totalCost, 0)
    const utilitiesCost = selectedUtilities.reduce((sum, u) => sum + u.totalCost, 0)
    const laborCost = selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0)
    return materialsCost + utilitiesCost + laborCost
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Thông tin sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="product" className="text-sm">
            Sản Phẩm
          </Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Chọn sản phẩm" />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.unit})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm">
            Số Lượng Sản Xuất
          </Label>
          <Input
            id="quantity"
            placeholder="Nhập số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {/* Nguyên liệu */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Nguyên Liệu</h3>
          <Button variant="outline" size="sm" onClick={addMaterial} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Thêm
          </Button>
        </div>
        <div className="space-y-3">
          {selectedMaterials.map((material, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nguyên liệu</Label>
                  <Select value={material.id} onValueChange={(value) => updateMaterial(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMaterials.map((mat) => (
                        <SelectItem key={mat.id} value={mat.id}>
                          {mat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Số lượng</Label>
                  <Input
                    placeholder="0"
                    value={material.quantity || ""}
                    onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Đơn vị: </span>
                  <span className="font-medium">{material.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">Đơn giá: </span>
                  <span className="font-medium">{material.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thành tiền: </span>
                  <span className="font-medium">{material.totalCost.toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeMaterial(index)}
                className="w-full text-red-600 text-xs"
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tiện ích */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Tiện Ích</h3>
          <Button variant="outline" size="sm" onClick={addUtility} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Thêm
          </Button>
        </div>
        <div className="space-y-3">
          {selectedUtilities.map((utility, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Tiện ích</Label>
                  <Select value={utility.id} onValueChange={(value) => updateUtility(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUtilities.map((util) => (
                        <SelectItem key={util.id} value={util.id}>
                          {util.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Số lượng</Label>
                  <Input
                    placeholder="0"
                    value={utility.quantity || ""}
                    onChange={(e) => updateUtility(index, "quantity", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Đơn vị: </span>
                  <span className="font-medium">{utility.unit}</span>
                </div>
                <div>
                  <span className="text-gray-600">Đơn giá: </span>
                  <span className="font-medium">{utility.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thành tiền: </span>
                  <span className="font-medium">{utility.totalCost.toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeUtility(index)}
                className="w-full text-red-600 text-xs"
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Nhân công */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold">Nhân Công</h3>
          <Button variant="outline" size="sm" onClick={addEmployee} className="text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Thêm
          </Button>
        </div>
        <div className="space-y-3">
          {selectedEmployees.map((employee, index) => (
            <div key={index} className="border rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Nhân viên</Label>
                  <Select value={employee.id} onValueChange={(value) => updateEmployee(index, "id", value)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Số giờ</Label>
                  <Input
                    placeholder="0"
                    value={employee.hours || ""}
                    onChange={(e) => updateEmployee(index, "hours", e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Chức vụ: </span>
                  <span className="font-medium">{employee.position}</span>
                </div>
                <div>
                  <span className="text-gray-600">Lương/giờ: </span>
                  <span className="font-medium">{employee.hourlyRate.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Thành tiền: </span>
                  <span className="font-medium">{employee.totalCost.toLocaleString()}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEmployee(index)}
                className="w-full text-red-600 text-xs"
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Tổng kết chi phí */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Tổng Kết Chi Phí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Chi phí nguyên liệu:</span>
              <span className="font-medium">
                {selectedMaterials.reduce((sum, m) => sum + m.totalCost, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Chi phí tiện ích:</span>
              <span className="font-medium">
                {selectedUtilities.reduce((sum, u) => sum + u.totalCost, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span>Chi phí nhân công:</span>
              <span className="font-medium">
                {selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span>Tổng chi phí:</span>
              <span>{calculateTotalCost().toLocaleString()} đ</span>
            </div>
            {quantity && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Chi phí trên đơn vị:</span>
                <span>
                  {(calculateTotalCost() / Number.parseFloat(quantity)).toFixed(0).toLocaleString()} đ/
                  {availableProducts.find((p) => p.id === selectedProduct)?.unit || "đơn vị"}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Hủy
        </Button>
        <Button onClick={onClose} className="w-full sm:w-auto">
          Lưu Đơn Sản Xuất
        </Button>
      </div>
    </div>
  )
}
