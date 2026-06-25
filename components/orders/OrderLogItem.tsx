import { IActivityLog } from "@/types/activity-log.interface"
import { Card, CardContent } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils.date"
import { useLanguage } from "@/contexts/language-context"
import { useMemo } from "react"
import { IOrderItem, OrderLogField } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatLargeCurrency } from "@/lib/utils.currency"

interface Props {
  logs: IActivityLog[]
}

export default function OrderLogItem({ logs }: Props) {
  const { t } = useLanguage()

  const getDisplayText = (field: string, value: any) => {
    switch (field) {
      case OrderLogField.status:
        return t(`orders.status.${value}`)
      case OrderLogField.deliveryDate:
        return formatDateTime(value)
      case OrderLogField.paymentMethod:
        return t(`orders.paymentMethod.${value}`)
      case OrderLogField.items:
        if (!value) return value
        return (
          <Table>
          <TableHeader>
              <TableRow className="text-center">
                <TableHead>{t("products.form.sku")}</TableHead>
                <TableHead>{t("orders.quantity")}</TableHead>
                <TableHead>{t("orders.unitPrice")}</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {value.map((item: IOrderItem, index: number) => (
              <TableRow key={item.id || index}>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatLargeCurrency(item.unitCost!)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )
      default:
        return value
    }
  }

  const activityLogMetadata = useMemo(() => {
    if (logs.length === 0) return {}
    return { 
      updatedUser: logs[0].updatedUser, 
      updatedAt: logs[0].updatedAt,
    }
  }, [logs])

  return (
    <Card>
      <CardContent className="p-5">
        <div className="w-full flex flex-row justify-between">
          <div className="flex flex-row">{t("orders.log.updater")}:&nbsp;<p className="font-bold">{activityLogMetadata.updatedUser}</p></div>
          <div>{formatDateTime(`${activityLogMetadata.updatedAt}`)}</div>
        </div>
        <div>
          {t("orders.log.fieldChange")}:
        </div>
        {
          logs.map((log) => (
            <div className="grid grid-cols-[20%_40%_40%] px-2" key={log.id}>
              <div className="font-bold">{t(`orders.log.${log.field}`)}</div>

              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {t("orders.log.from")}: {getDisplayText(log.field!, log.oldValue)}
              </div>

              <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                {t("orders.log.to")}: {getDisplayText(log.field!, log.newValue)}
              </div>
            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}