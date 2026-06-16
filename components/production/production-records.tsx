import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductionRecordItem } from "@/components/production/production-record-item"
import type { ProductionRecord } from "@/types/production"
import { useLanguage } from "@/contexts/language-context"

interface ProductionRecordsProps {
  records: ProductionRecord[]
  onViewRecord: (record: ProductionRecord) => void
  onEditRecord: (record: ProductionRecord) => void
}

export function ProductionRecords({ records, onViewRecord, onEditRecord }: ProductionRecordsProps) {
  const { t } = useLanguage()
  return (
    <Card>
      <CardHeader className="hidden lg:block">
        <CardTitle className="text-base sm:text-lg">{t("production.record.todayProduction")}</CardTitle>
        <CardDescription className="text-sm">{t("production.record.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-3 lg:pt-0">
          {records.map((record) => (
            <ProductionRecordItem key={record.id} record={record} onView={onViewRecord} onEdit={onEditRecord} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
