"use client"

import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ISetting } from "@/types/setting.interface"

type SettingValueProps = {
  setting: ISetting
  className?: string
}

export function SettingValue({ setting, className }: SettingValueProps) {
  const mapUrl = getGoogleMapsUrl(setting)
  const displayValue = getDisplayValue(setting)

  if (!mapUrl) {
    return <span className={className}>{displayValue}</span>
  }

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1 text-primary hover:underline", className)}
    >
      <span>{displayValue}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  )
}

function getGoogleMapsUrl(setting: ISetting) {
  if (setting.key !== "maps" && setting.configType !== "map") return null

  if (typeof setting.value === "string") {
    if (setting.value.startsWith("http")) return setting.value

    const match = setting.value.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/)
    if (!match) return null

    const latitude = Number(match[1])
    const longitude = Number(match[2])
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`
  }

  if (Array.isArray(setting.value) && typeof setting.value[0] === "string") {
    return setting.value[0]
  }

  if (!isRecord(setting.value)) return null

  if (typeof setting.value.lat === "number" && typeof setting.value.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${setting.value.lat},${setting.value.lng}`)}`
  }
  return null
}

function getDisplayValue(setting: ISetting) {
  if (typeof setting.value === "string") return setting.value
  if (setting.value === null || setting.value === undefined) return "-"
  if (Array.isArray(setting.value)) return setting.value.join(", ")
  if (!isRecord(setting.value)) return String(setting.value)

  return JSON.stringify(setting.value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
