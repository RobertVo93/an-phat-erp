export interface BrandSettings {
  name: string
  subName: string
  owner: string
  address: string
  phone: string
  email: string
  facebook: string
  youtube: string
  maps: string[]
}

export interface MapSettings {
  maps: string[]
  latitude: number
  longitude: number
}

export interface ContactSettings {
  phone: string
  email: string
  address: string
  facebook: string
  zalo: string
  website: string
  workingHour: string
}

export interface Settings {
  brand: BrandSettings
  map: MapSettings
  contact: ContactSettings
}

export const settingConfigTypes = ["brand", "map", "contact"] as const

export type SettingConfigType = (typeof settingConfigTypes)[number]

export const settingKeysByConfigType = {
  brand: ["name", "subName", "owner", "address", "phone", "email", "facebook", "youtube", "maps"],
  map: ["maps", "latitude", "longitude"],
  contact: ["phone", "email", "address", "facebook", "zalo", "website", "workingHour"],
} as const satisfies {
  [Type in SettingConfigType]: readonly (keyof Settings[Type])[]
}

export type SettingKeyByConfigType<T extends SettingConfigType> = Extract<keyof Settings[T], string>

export type SettingKey = {
  [Type in SettingConfigType]: SettingKeyByConfigType<Type>
}[SettingConfigType]

export type SettingValue = {
  [Type in SettingConfigType]: Settings[Type][SettingKeyByConfigType<Type>]
}[SettingConfigType]
