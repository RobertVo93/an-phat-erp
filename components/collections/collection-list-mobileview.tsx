import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collection } from "@/types";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils.date";
import { Badge } from "@/components/ui/badge";
import CollectionActions from "@/components/collections/collection-actions";
import { getCollectionSaleableColor, getCollectionStatusColor } from "@/lib/utils.style";

interface Props {
  collections: Collection[]
  totalPages: number
  currentPage: number
  handlePageChange: (page: number) => void
  handleView: (collection: Collection) => void
  handleEdit: (collection: Collection) => void
  handleDelete: (collection: Collection) => void
}

export default function CollectionListMobileView({
  collections,
  totalPages,
  currentPage,
  handlePageChange,
  handleView,
  handleEdit,
  handleDelete
}: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-1">
      {collections.length > 0 ? (
        collections.map((collection) => (
          <Card key={collection.id} className="border border-gray-200 hover:bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {collection.image ? (
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-2">

                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-medium truncate">{collection.name}</h3>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <Badge className={`${getCollectionStatusColor(collection.status!)} text-xs`}>
                          {t(`collections.status.${collection.status!}`)}
                        </Badge>
                        <Badge className={`${getCollectionSaleableColor(collection.saleable)} text-xs`}>
                          {collection.saleable ? t("collections.saleable.yes") : t("collections.saleable.no")}
                        </Badge>
                      </div>
                    </div>

                    <CollectionActions
                      collection={collection}
                      handleView={handleView}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {collection.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">{collection.products?.length || 0}</span> {t("collections.products")}
                    </div>
                    <div>{t("collections.form.saleable")}: {collection.saleable ? t("common.yes") : t("common.no")}</div>
                    <div className="col-span-2 md:col-span-2">{t("collections.createdAt")}: {formatDate(collection.createdAt!)}</div>
                  </div>
                </div>
              </div>


            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>{t("collections.noCollectionsFound")}</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-1 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-1">
            {(() => {
              const maxVisible = 5
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
              const endPage = Math.min(totalPages, startPage + maxVisible - 1)

              if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1)
              }

              return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8 p-0 text-xs"
                >
                  {page}
                </Button>
              ))
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
