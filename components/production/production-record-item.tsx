"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Edit, Eye } from "lucide-react"
import type { ProductionRecord } from "@/types/production"

interface ProductionRecordItemProps {
  record: ProductionRecord
  onView: (record: ProductionRecord) => void
  onEdit: (record: ProductionRecord) => void
}

export function ProductionRecordItem({ record, onView, onEdit }: ProductionRecordItemProps) {
  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-sm sm:text-base">{record.product}</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {record.quantity} {record.unit} • Ca {record.shift} • {record.operator}
            </p>
          </div>
          <Badge variant={record.status === "completed" ? "default" : "secondary"} className="text-xs">
            {record.status === "completed" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <Clock className="w-3 h-3 mr-1" />
            )}
            {record.statusText}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(record)} className="text-xs">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Xem Chi Tiết</span>
            <span className="sm:hidden">Xem</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onEdit(record)}>
            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Chỉnh Sửa</span>
            <span className="sm:hidden">Sửa</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-8 sm:h-10">
          <TabsTrigger value="materials" className="text-xs sm:text-sm">
            NL
          </TabsTrigger>
          <TabsTrigger value="utilities" className="text-xs sm:text-sm">
            TI
          </TabsTrigger>
          <TabsTrigger value="labor" className="text-xs sm:text-sm">
            NC
          </TabsTrigger>
          <TabsTrigger value="summary" className="text-xs sm:text-sm">
            TK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-2 mt-3">
          {record.rawMaterials.map((material, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs sm:text-sm">
              <span className="font-medium">{material.name}</span>
              <div className="text-right">
                <div>
                  {material.quantity} {material.unit}
                </div>
                <div className="text-xs text-gray-600">{material.cost.toLocaleString()} đ</div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="utilities" className="space-y-2 mt-3">
          {record.utilities.map((utility, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs sm:text-sm">
              <span className="font-medium">{utility.name}</span>
              <div className="text-right">
                <div>
                  {utility.quantity} {utility.unit}
                </div>
                <div className="text-xs text-gray-600">{utility.cost.toLocaleString()} đ</div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="labor" className="space-y-2 mt-3">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 bg-gray-50 rounded">
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{record.labor.hours} giờ</div>
              <div className="text-xs text-gray-600">Tổng Giờ</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{record.labor.workers} người</div>
              <div className="text-xs text-gray-600">Công Nhân</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{record.labor.cost.toLocaleString()} đ</div>
              <div className="text-xs text-gray-600">Chi Phí NC</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="summary" className="space-y-2 mt-3">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 bg-gray-50 rounded">
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{record.totalCost.toLocaleString()} đ</div>
              <div className="text-xs text-gray-600">Tổng CP</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">
                {(record.totalCost / record.quantity).toFixed(0).toLocaleString()} đ
              </div>
              <div className="text-xs text-gray-600">CP/kg</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm sm:text-base">{record.efficiency}%</div>
              <div className="text-xs text-gray-600">Hiệu Suất</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
