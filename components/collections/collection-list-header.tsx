"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Dispatch, SetStateAction } from "react"

interface Props {
  startIndex: number
  endIndex: number
  totalCollections: number
  itemsPerPage: number

  setItemsPerPage: Dispatch<SetStateAction<number>>
}

export default function CollectionListHeader({
  startIndex,
  endIndex,
  totalCollections,
  itemsPerPage,

  setItemsPerPage
}:Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <CardTitle className="text-lg md:text-xl">{t("collections.allCollections")}</CardTitle>
        <CardDescription className="text-sm">{t("collections.allCollectionsDesc")}</CardDescription>
      </div>

      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <span className="text-xs md:text-sm text-muted-foreground">
          {startIndex}-{endIndex} / {totalCollections}
        </span>
        <div className="flex items-center space-x-2">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
          >
            <SelectTrigger className="w-16 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">/ {t("common.page")}</span>
        </div>
      </div>
    </div>
  )
}