import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Plus } from "lucide-react"

interface UtilityUsageHeaderProps {
  onCreate: () => void
}

export function UtilityUsageHeader({ onCreate }: UtilityUsageHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("utilityUsage.title")}</h2>
        <p className="text-muted-foreground">{t("utilityUsage.subtitle")}</p>
      </div>
      <Button onClick={onCreate} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" />
        {t("utilityUsage.newUsage")}
      </Button>
    </div>
  )
}
