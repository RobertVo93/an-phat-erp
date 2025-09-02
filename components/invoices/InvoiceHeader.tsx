import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Plus } from "lucide-react"
import React from "react"

interface InvoiceHeaderProps {
  onCreate: () => void
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ onCreate }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("invoices.title")}</h2>
        <p className="text-muted-foreground">{t("invoices.description")}</p>
      </div>
      <Button onClick={onCreate} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        {t("invoices.create")}
      </Button>
    </div>
  )
}
