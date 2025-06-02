import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ProductionRecord } from "@/types/production"

interface ProductionDetailModalProps {
  record: ProductionRecord | null
  isOpen: boolean
  onClose: () => void
}

export function ProductionDetailModal({ record, isOpen, onClose }: ProductionDetailModalProps) {
  if (!record) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Đơn Sản Xuất - {record.id}</DialogTitle>
          <DialogDescription>Thông tin chi tiết cho đợt sản xuất {record.product}</DialogDescription>
        </DialogHeader>
        <ProductionDetailView record={record} />
      </DialogContent>
    </Dialog>
  )
}

function ProductionDetailView({ record }: { record: ProductionRecord }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Thông Tin Sản Xuất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sản phẩm:</span>
              <span className="font-medium">{record.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số lượng:</span>
              <span className="font-medium">
                {record.quantity} {record.unit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày:</span>
              <span className="font-medium">{record.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ca:</span>
              <span className="font-medium">{record.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Người vận hành:</span>
              <span className="font-medium">{record.operator}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Tổng Kết Chi Phí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nguyên liệu:</span>
              <span className="font-medium">
                {record.rawMaterials.reduce((sum, m) => sum + m.cost, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiện ích:</span>
              <span className="font-medium">
                {record.utilities.reduce((sum, u) => sum + u.cost, 0).toLocaleString()} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nhân công:</span>
              <span className="font-medium">{record.labor.cost.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Tổng chi phí:</span>
              <span className="font-semibold">{record.totalCost.toLocaleString()} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chi phí/kg:</span>
              <span className="font-medium">{(record.totalCost / record.quantity).toFixed(0).toLocaleString()} đ</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Nguyên Liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.rawMaterials.map((material, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{material.name}</div>
                    <div className="text-xs text-gray-600">
                      {material.quantity} {material.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{material.cost.toLocaleString()} đ</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Tiện Ích</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.utilities.map((utility, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                  <div>
                    <div className="font-medium">{utility.name}</div>
                    <div className="text-xs text-gray-600">
                      {utility.quantity} {utility.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{utility.cost.toLocaleString()} đ</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Chi Tiết Nhân Công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
                <div className="text-lg sm:text-xl font-bold">{record.labor.hours} giờ</div>
                <div className="text-xs text-gray-600">Tổng thời gian làm việc</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
                <div className="text-lg sm:text-xl font-bold">{record.labor.workers} người</div>
                <div className="text-xs text-gray-600">Số lượng công nhân</div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-gray-50 rounded">
                <div className="text-lg sm:text-xl font-bold">{record.labor.cost.toLocaleString()} đ</div>
                <div className="text-xs text-gray-600">Tổng chi phí nhân công</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
