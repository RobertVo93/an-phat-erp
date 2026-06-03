export function getSettingTypeLabel(value: string | undefined, t: (key: string) => string) {
  if (!value) return t("settings.other")

  const translationKey = `settings.${value}`
  const translated = t(translationKey)
  return translated === translationKey ? value : translated
}
