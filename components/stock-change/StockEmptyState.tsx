import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import React from "react"

interface Props {
  onNewOrderClick: () => void
}

export const StockEmptyState: React.FC<Props> = ({ onNewOrderClick }) => {
  const { t } = useLanguage()
  return (
    <div className="text-center py-8 px-4">
      <p className="text-muted-foreground">{t("stockIn.noRecords")}</p>
      <Button variant="outline" className="mt-4" onClick={onNewOrderClick}>
        {t("stockIn.addFirstRecord")}
      </Button>
    </div>
  )
}