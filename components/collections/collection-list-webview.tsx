import { useLanguage } from "@/contexts/language-context";
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Collection } from "@/types";
import { ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils.date";
import { Badge } from "@/components/ui/badge";
import CollectionActions from "@/components/collections/collection-actions";
import { getCollectionStatusColor } from "@/lib/utils.style";

interface Props {
  collections: Collection[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  totalPages: number
  loading: boolean

  handlePageChange: (page: number) => void
  handleSort: (field: string) => void
  handleView: (collection: Collection) => void
  handleEdit: (collection: Collection) => void
  handleDelete: (collection: Collection) => void
}

export default function CollectionListWebview({
  collections,
  total,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  totalPages,
  loading,

  handlePageChange,
  handleSort,
  handleView,
  handleEdit,
  handleDelete
}: Props) {
  const { t } = useLanguage();

  // Define columns for ServersideTable
  const columns: ServersideTableColumn<any>[] = [
    {
      key: "image",
      title: t("collections.form.image"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1 max-w-[120px]">
          {row.image ? (
            <img
              src={row.image || "/placeholder.svg"}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      title: t("collections.title"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.number}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("collections.form.status"),
      sortable: true,
      render: (row) => (
        <div className="flex flex-wrap space-y-1 items-center gap-1 mt-1">
          <Badge className={`${getCollectionStatusColor(row.status!)} text-xs`}>
            {t(`collections.status.${row.status!}`)}
          </Badge>
        </div>
      ),
    },
    {
      key: "description",
      title: t("collections.form.description"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.description}</p>
        </div>
      ),
    },
    {
      key: "totalProducts",
      title: t("collections.totalProducts"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.products?.length || 0}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      title: t("collections.createdAt"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <CollectionActions
            collection={row}
            handleView={handleView}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      ),
    },
  ]
  return (
    <ServersideTable
      columns={columns}
      data={collections}
      total={total}
      currentPage={currentPage}
      pageSize={pageSize}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onPageChange={handlePageChange}
      onSort={handleSort}
      loading={loading}
      totalPages={totalPages}
    />
  )
}