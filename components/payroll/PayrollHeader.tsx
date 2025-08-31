import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { UIDatePicker } from "../ui/datepicker"

interface PayrollHeaderProps {
  payPeriod: Date
  onPayPeriodChange: (selectedPeriod: Date) => void
  onExport: () => void
  onSyncPayroll: (selectedPeriod: Date) => void
}

export const PayrollHeader: React.FC<PayrollHeaderProps> = ({ payPeriod, onExport, onSyncPayroll, onPayPeriodChange }) => {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("payroll.title")}</h2>
        <p className="text-muted-foreground">{t("payroll.description")}</p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <UIDatePicker
          selected={payPeriod}
          onChange={(date) => onPayPeriodChange(date!)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          showIcon={true}
        />
        <Button variant="outline" onClick={() => onSyncPayroll(payPeriod)} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("payroll.syncPayroll")}
        </Button>
        <Button onClick={onExport} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {t("payroll.exportPayroll")}
        </Button>
      </div>
    </div>
  )
}
