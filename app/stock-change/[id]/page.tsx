"use client"

import { ERPLayout } from "@/components/erp-layout"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { env } from "@/constants/env"
import { formatDateTime, formatLargeCurrency, getStockChangeStatusColor } from "@/lib/utils"
import { getStockChangeById } from "@/lib/httpclient/stock-change.client"
import type { StockChange } from "@/types/stock-change"
import { Calendar, Hash, MapPin, Package, User, Warehouse } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function StockChangeDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<StockChange | null>(null)

  useEffect(() => {
    let isCancelled = false

    const fetchDetail = async () => {
      try {
        setLoading(true)
        const data = await getStockChangeById(id)
        if (!isCancelled) {
          setRecord(data as StockChange)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error)
          setRecord(null)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchDetail()
    }

    return () => {
      isCancelled = true
    }
  }, [id])

  if (!record && !loading) {
    return (
      <ERPLayout>
        <div className="py-8 text-center text-muted-foreground">{t("common.noData")}</div>
      </ERPLayout>
    )
  }

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />

      {record && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Package className="h-5 w-5" />
              {t("stockIn.view")} - {record.number}
            </h2>
            <Badge className={getStockChangeStatusColor(record.status!)}>{t(`stockIn.status.${record.status}`)}</Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("stockIn.form.title.view")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.receiptNumber")}</p>
                      <p className="font-semibold">{record.number}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.date")}</p>
                      <p className="font-semibold">{formatDateTime(`${record.date}`)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.warehouse")}</p>
                      <p className="font-semibold">{record.warehouse?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Warehouse className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">{t("stockIn.supplier")}</p>
                      <p className="font-semibold">{record.supplier}</p>
                    </div>
                  </div>

                  {record.receivedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">{t("stockIn.receivedBy")}</p>
                        <p className="font-semibold">{record.receivedBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("stockIn.products")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {record.stockProducts?.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-4">
                    <div className="md:col-span-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.sku}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.quantity")}</p>
                      <p className="font-semibold">{item.quantity?.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.unitCost")}</p>
                      <p className="font-semibold">{formatLargeCurrency(item.unitCost ?? 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{t("stockIn.form.totalCost")}</p>
                      <p className="font-semibold">{formatLargeCurrency((item.unitCost ?? 0) * (item.quantity ?? 0))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("stockIn.totalAmount")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>{t("stockIn.form.subtotal")}:</span>
                  <span className="font-semibold">{formatLargeCurrency(record.subtotal ?? 0)}</span>
                </div>

                {env.NEXT_PUBLIC_TAX_RATE > 0 && (
                  <div className="flex justify-between">
                    <span>{t("stockIn.form.tax")} ({env.NEXT_PUBLIC_TAX_RATE}%):</span>
                    <span className="font-semibold">{formatLargeCurrency(record.tax ?? 0)}</span>
                  </div>
                )}

                {(record.discount ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span>{t("stockIn.form.discount")}:</span>
                    <span className="font-semibold text-red-600">-{formatLargeCurrency(record.discount ?? 0)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>{t("stockIn.totalAmount")}:</span>
                  <span>{formatLargeCurrency(record.totalAmount ?? 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {record.notes && (
            <Card>
              <CardHeader>
                <CardTitle>{t("stockIn.notes")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{record.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ERPLayout>
  )
}
