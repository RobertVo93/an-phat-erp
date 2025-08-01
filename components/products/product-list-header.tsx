import { Plus, Search, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProductListHeaderProps {
    t: (key: string) => string
    handleCreate: () => void
    searchTerm: string
    setSearchTerm: (value: string) => void
    setFilterModalOpen: (value: boolean) => void
    hasActiveFilters: boolean
    filters: any
}

export function ProductListHeader({
    t,
    searchTerm,
    hasActiveFilters,
    filters,
    handleCreate,
    setSearchTerm,
    setFilterModalOpen,
}: ProductListHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("products.title")}</h2>
                    <p className="text-sm text-muted-foreground">{t("products.description")}</p>
                </div>
                <Button onClick={handleCreate} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="sm:hidden">{t("products.addProduct")}</span>
                    <span className="hidden sm:inline">{t("products.addProduct")}</span>
                </Button>
            </div>

            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder={t("products.searchPlaceholder")}
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setFilterModalOpen(true)}
                    className={`w-full sm:w-auto ${hasActiveFilters ? "border-blue-500 text-blue-600" : ""}`}
                >
                    <Filter className="mr-2 h-4 w-4" />
                    <span className="sm:hidden">{t("products.filter")}</span>
                    <span className="hidden sm:inline">{t("products.filter")}</span>
                    {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                            {Object.keys(filters).length}
                        </Badge>
                    )}
                </Button>
            </div>
        </div>
    )
}