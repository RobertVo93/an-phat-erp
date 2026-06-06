import { useLanguage } from "@/contexts/language-context"

export function SettingHeader() {
  const { t } = useLanguage()

  return (
    <div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("settings.title")}</h2>
        <p className="text-muted-foreground">{t("settings.detailDescription")}</p>
      </div>
    </div>
  )
}
