import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Plus } from "lucide-react"
import React from "react"

interface UtilityHeaderProps {
  onAdd: () => void
}

export const UtilityHeader: React.FC<UtilityHeaderProps> = ({ onAdd }) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("utilities.title")}</h2>
        <p className="text-muted-foreground">{t("utilities.detailDescription")}</p>
      </div>
      <Button onClick={onAdd} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        {t("utilities.addUtility")}
      </Button>
    </div>
  )
}

