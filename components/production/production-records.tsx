import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductionRecordItem } from "./production-record-item"
import type { ProductionRecord } from "@/types/production"

interface ProductionRecordsProps {
  records: ProductionRecord[]
  onViewRecord: (record: ProductionRecord) => void
  onEditRecord: (record: ProductionRecord) => void
}

export function ProductionRecords({ records, onViewRecord, onEditRecord }: ProductionRecordsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Đơn Sản Xuất Hôm Nay</CardTitle>
        <CardDescription className="text-sm">Chi tiết các đợt sản xuất và dữ liệu tiêu thụ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.map((record) => (
            <ProductionRecordItem key={record.id} record={record} onView={onViewRecord} onEdit={onEditRecord} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
