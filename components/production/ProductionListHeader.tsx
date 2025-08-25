import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ProductionListHeaderProps {
  openNewProduction: () => void
}

export const ProductionListHeader = ({ openNewProduction }: ProductionListHeaderProps) => {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("production.management")}</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">

        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <Button className="w-full sm:w-auto" onClick={openNewProduction}>
          <Plus className="mr-2 h-4 w-4" />
          {t("production.newProduction")}
        </Button>
      </div>
    </div>
  )
}