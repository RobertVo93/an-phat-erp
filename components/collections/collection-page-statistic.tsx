
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Collection, CollectionStatus } from "@/types"

interface Props {
  collections: Collection[]
  totalCollections: number
}

export default function CollectionPageStatistic({
  collections, totalCollections
}: Props) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">{t("collections.totalCollections")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{totalCollections}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">{t("collections.activeCollections")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {collections.filter((col) => col.status === CollectionStatus.active).length}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}