import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Calculator } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { PayrollStats } from "@/types/payroll"

interface PayrollStatsCardsProps {
  stats: PayrollStats
}

export const PayrollStatsCards: React.FC<PayrollStatsCardsProps> = ({ stats }) => {
  const { t } = useLanguage()
  const formatCurrency = (amount: number) => `${amount.toLocaleString()} VND`
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("payroll.totalPayroll")}</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalPayroll)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("payroll.averageSalary")}</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(Math.round(stats.averageSalary))}</div>
          <p className="text-xs text-muted-foreground">{t("payroll.perEmployee")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("payroll.processed")}</CardTitle>
          <FileText className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.processedCount}</div>
          <p className="text-xs text-muted-foreground">
            {t("payroll.outOf")} {stats.processedCount + stats.pendingCount} {t("payroll.employees")}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("payroll.pending")}</CardTitle>
          <Calculator className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingCount}</div>
          <p className="text-xs text-muted-foreground">{t("payroll.awaitingProcessing")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
