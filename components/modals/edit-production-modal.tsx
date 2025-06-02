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

// Dữ liệu mẫu
const availableProducts = [
  { id: "rice-noodles", name: "Mì Gạo", unit: "kg" },
  { id: "wheat-noodles", name: "Mì Lúa Mì", unit: "kg" },
  { id: "instant-noodles", name: "Mì Ăn Liền", unit: "gói" },
  { id: "pho-noodles", name: "Bánh Phở", unit: "kg" },
]

const availableMaterials = [
  { id: "rice", name: "Gạo", unit: "kg", price: 25000 },
  { id: "wheat-flour", name: "Bột mì", unit: "kg", price: 18000 },
  { id: "water", name: "Nước", unit: "L", price: 5000 },
  { id: "salt", name: "Muối", unit: "kg", price: 8000 },
  { id: "eggs", name: "Trứng", unit: "quả", price: 3500 },
  { id: "oil", name: "Dầu ăn", unit: "L", price: 45000 },
  { id: "starch", name: "Tinh bột", unit: "kg", price: 22000 },
]

const availableUtilities = [
  { id: "electricity", name: "Điện", unit: "kWh", price: 3500 },
  { id: "gas", name: "Gas", unit: "m³", price: 15000 },
  { id: "water-utility", name: "Nước (tiện ích)", unit: "m³", price: 12000 },
  { id: "steam", name: "Hơi nước", unit: "kg", price: 8000 },
]

const availableEmployees = [
  {
    id: "emp001",
    name: "Nguyễn Văn A",
    position: "Trưởng ca",
    hourlyRate: 85000,
    department: "Sản xuất",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp002",
    name: "Trần Thị B",
    position: "Công nhân",
    hourlyRate: 65000,
    department: "Sản xuất",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp003",
    name: "Lê Văn C",
    position: "Kỹ thuật viên",
    hourlyRate: 75000,
    department: "Kỹ thuật",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp004",
    name: "Phạm Thị D",
    position: "Công nhân",
    hourlyRate: 60000,
    department: "Sản xuất",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp005",
    name: "Hoàng Văn E",
    position: "Kiểm soát chất lượng",
    hourlyRate: 80000,
    department: "QC",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const statusOptions = [
  { value: "in-progress", label: "Đang sản xuất", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Hoàn thành", color: "bg-green-100 text-green-800" },
  { value: "paused", label: "Tạm dừng", color: "bg-orange-100 text-orange-800" },
  { value: "cancelled", label: "Hủy bỏ", color: "bg-red-100 text-red-800" },
]

const shiftOptions = [
  { value: "morning", label: "Ca Sáng (6:00 - 14:00)" },
  { value: "afternoon", label: "Ca Chiều (14:00 - 22:00)" },
  { value: "night", label: "Ca Đêm (22:00 - 6:00)" },
]

interface EditProductionModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onSave: (updatedRecord: any) => void
}

export function EditProductionModal({ isOpen, onClose, record, onSave }: EditProductionModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    product: "",
    quantity: "",
    status: "",
    shift: "",
    operator: "",
    date: "",
    efficiency: "",
  })

  const [selectedMaterials, setSelectedMaterials] = useState<
    Array<{
      id: string
      name: string
      quantity: number
      unit: string
      price: number
      totalCost: number
    }>
  >([])

  const [selectedUtilities, setSelectedUtilities] = useState<
    Array<{
      id: string
      name: string
      quantity: number
      unit: string
      price: number
      totalCost: number
    }>
  >([])

  const [selectedEmployees, setSelectedEmployees] = useState<
    Array<{
      id: string
      name: string
      position: string
      hours: number
      hourlyRate: number
      totalCost: number
    }>
  >([])

  // Load dữ liệu từ record khi modal mở
  useEffect(() => {
    if (record && isOpen) {
      setFormData({
        id: record.id,
        product: getProductIdByName(record.product),
        quantity: record.quantity.toString(),
        status: record.status,
        shift: getShiftValueByText(record.shift),
        operator: record.operator,
        date: record.date,
        efficiency: record.efficiency.toString(),
      })

      // Load materials
      const materials = record.rawMaterials.map((material: any) => ({
        id: getMaterialIdByName(material.name),
        name: material.name,
        quantity: material.quantity,
        unit: material.unit,
        price: material.cost / material.quantity,
        totalCost: material.cost,
      }))
      setSelectedMaterials(materials)

      // Load utilities
      const utilities = record.utilities.map((utility: any) => ({
        id: getUtilityIdByName(utility.name),
        name: utility.name,
        quantity: utility.quantity,
        unit: utility.unit,
        price: utility.cost / utility.quantity,
        totalCost: utility.cost,
      }))
      setSelectedUtilities(utilities)

      // Load employees (giả sử có thông tin nhân viên)
      const employees = [
        {
          id: "emp001",
          name: record.operator,
          position: "Trưởng ca",
          hours: record.labor.hours,
          hourlyRate: record.labor.cost / record.labor.hours,
          totalCost: record.labor.cost,
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

  // Utility functions
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

  const handleSave = () => {
    const updatedRecord = {
      ...record,
      product: availableProducts.find((p) => p.id === formData.product)?.name || record.product,
      quantity: Number.parseFloat(formData.quantity),
      status: formData.status,
      statusText: statusOptions.find((s) => s.value === formData.status)?.label || record.statusText,
      shift: shiftOptions.find((s) => s.value === formData.shift)?.label.split(" ")[1] || record.shift,
      operator: formData.operator,
      date: formData.date,
      efficiency: Number.parseFloat(formData.efficiency),
      rawMaterials: selectedMaterials.map((m) => ({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
        cost: m.totalCost,
      })),
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

  const currentStatus = statusOptions.find((s) => s.value === formData.status)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Chỉnh Sửa Đơn Sản Xuất - {formData.id}
            {currentStatus && <Badge className={currentStatus.color}>{currentStatus.label}</Badge>}
          </DialogTitle>
          <DialogDescription>Cập nhật thông tin đơn sản xuất và chi phí liên quan</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin cơ bản */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông Tin Cơ Bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Sản Phẩm</Label>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => setFormData({ ...formData, product: value })}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="quantity">Số Lượng</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Nhập số lượng"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng Thái</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
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
                  <Label htmlFor="shift">Ca Làm Việc</Label>
                  <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ca" />
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
                  <Label htmlFor="operator">Người Vận Hành</Label>
                  <Input
                    id="operator"
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    placeholder="Tên người vận hành"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="efficiency">Hiệu Suất (%)</Label>
                  <Input
                    id="efficiency"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                    placeholder="Hiệu suất"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nguyên liệu */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Nguyên Liệu Sử Dụng</CardTitle>
                <Button variant="outline" size="sm" onClick={addMaterial}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm Nguyên Liệu
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedMaterials.map((material, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
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
                      <div className="space-y-1">
                        <Label className="text-xs">Đơn vị</Label>
                        <Input value={material.unit} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Đơn giá</Label>
                        <Input value={material.price.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Thành tiền</Label>
                        <Input value={material.totalCost.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs opacity-0">Action</Label>
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
                <CardTitle className="text-lg">Tiện Ích Sử Dụng</CardTitle>
                <Button variant="outline" size="sm" onClick={addUtility}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm Tiện Ích
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
                      <div className="space-y-1">
                        <Label className="text-xs">Đơn vị</Label>
                        <Input value={utility.unit} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Đơn giá</Label>
                        <Input value={utility.price.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Thành tiền</Label>
                        <Input value={utility.totalCost.toLocaleString()} disabled className="h-9" />
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
                <CardTitle className="text-lg">Nhân Công</CardTitle>
                <Button variant="outline" size="sm" onClick={addEmployee}>
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm Nhân Viên
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedEmployees.map((employee, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
                      <div className="space-y-1 lg:col-span-2">
                        <Label className="text-xs">Nhân viên</Label>
                        <Select value={employee.id} onValueChange={(value) => updateEmployee(index, "id", value)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn nhân viên" />
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
                        <Label className="text-xs">Chức vụ</Label>
                        <Input value={employee.position} disabled className="h-9" />
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
                      <div className="space-y-1">
                        <Label className="text-xs">Lương/giờ</Label>
                        <Input value={employee.hourlyRate.toLocaleString()} disabled className="h-9" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Thành tiền</Label>
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
              <CardTitle className="text-lg">Tổng Kết Chi Phí</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedMaterials.reduce((sum, m) => sum + m.totalCost, 0).toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">Chi phí nguyên liệu</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedUtilities.reduce((sum, u) => sum + u.totalCost, 0).toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">Chi phí tiện ích</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedEmployees.reduce((sum, e) => sum + e.totalCost, 0).toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">Chi phí nhân công</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{calculateTotalCost().toLocaleString()} đ</div>
                  <div className="text-sm text-gray-600">Tổng chi phí</div>
                </div>
              </div>
              {formData.quantity && (
                <div className="mt-4 text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold">
                    Chi phí trên đơn vị:{" "}
                    {(calculateTotalCost() / Number.parseFloat(formData.quantity)).toFixed(0).toLocaleString()} đ/
                    {availableProducts.find((p) => p.id === formData.product)?.unit || "đơn vị"}
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
            Hủy
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Lưu Thay Đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
