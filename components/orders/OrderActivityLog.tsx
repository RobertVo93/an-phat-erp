import { useLanguage } from "@/contexts/language-context"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card"
import { IActivityLog } from "@/types/activity-log.interface"
import OrderLogItem from "@/components/orders/OrderLogItem"
import { useMemo } from "react"

interface Props {
  activityLogs: IActivityLog[]
}

export const OrderActivityLog = ({ activityLogs }: Props) => {
  const { t } = useLanguage()

  const groupedLogs = useMemo(() => {
    // group by transactionId to display the logs in the same transaction
    return activityLogs.reduce((acc, log) => {
      if (!log.transactionId) return acc
      acc[log.transactionId] = [...(acc[log.transactionId] || []), log]
      return acc
    }, {} as Record<string, IActivityLog[]>)
  }, [activityLogs])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("orders.log.title")}</CardTitle>
        <CardDescription>{t("orders.log.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(groupedLogs).map((log, index) => (
          <OrderLogItem logs={log} key={index} />
        ))}
      </CardContent>
    </Card>
  )
}