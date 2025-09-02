import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { formatLargeCurrency } from "@/lib/utils"

interface InvoiceStatsCardsProps {
  stats: {
    totalInvoices: number
    totalAmount: number
    pendingCount: number
    overdueCount: number
  }
}

export const InvoiceStatsCards: React.FC<InvoiceStatsCardsProps> = ({ stats }) => {
  const { t } = useLanguage()
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("invoices.stats.totalInvoices")}</CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.totalInvoices}</div>
          <p className="text-xs text-muted-foreground">{t("invoices.stats.totalInvoices")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("invoices.stats.totalAmount")}</CardTitle>
          <FileText className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl font-bold">{formatLargeCurrency(stats.totalAmount)}</div>
          <p className="text-xs text-muted-foreground">{t("invoices.stats.totalAmount")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("invoices.stats.pendingCount")}</CardTitle>
          <FileText className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.pendingCount}</div>
          <p className="text-xs text-muted-foreground">{t("invoices.stats.pendingCount")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("invoices.stats.overdueCount")}</CardTitle>
          <FileText className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.overdueCount}</div>
          <p className="text-xs text-muted-foreground">{t("invoices.stats.overdueCount")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
