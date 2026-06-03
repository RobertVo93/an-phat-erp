import type { SettingConfigType } from "@/types/setting.interface"

export const settingConfigTypes: SettingConfigType[] = [
  "brand",
  "map",
  "contact",
  "other",
]

export const settingKeysByConfigType: Record<string, string[]> = {
  brand: ["name", "subName", "owner", "address", "phone", "email", "facebook", "youtube", "maps"],
  map: ["maps", "latitude", "longitude"],
  contact: ["phone", "email", "address", "facebook", "zalo", "website", "workingHour"],
  other: ["value"],
}
