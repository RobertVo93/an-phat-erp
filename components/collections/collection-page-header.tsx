import { Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CollectionFilters, CollectionStatus } from "@/types";
import { Dispatch, SetStateAction } from "react";

interface Props {
  filters: CollectionFilters
  setFilters: Dispatch<SetStateAction<CollectionFilters>>
  handleCreate: () => void
  exportToCSV: () => void
}

export default function CollectionPageHeader({
  filters,
  setFilters,
  handleCreate,
  exportToCSV,
}: Props) {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("collections.title")}</h2>
          <p className="text-sm md:text-base text-muted-foreground">{t("collections.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV} size="sm" className="flex-1 md:flex-none">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("collections.exportExcel")}</span>
            <span className="sm:hidden">{t("common.export")}</span>
          </Button>
          <Button onClick={handleCreate} size="sm" className="flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t("collections.newCollection")}</span>
            <span className="sm:hidden">{t("common.add")}</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t("collections.searchPlaceholder")}
            className="pl-10 text-sm"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-2 w-[150px]">
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t("collections.form.allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("collections.form.allStatus")}</SelectItem>
              {Object.keys(CollectionStatus).map((status, index) => (
                <SelectItem key={index} value={status}>{t(`collections.status.${status}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}