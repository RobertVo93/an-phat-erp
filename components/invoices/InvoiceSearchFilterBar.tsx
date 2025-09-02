import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import React, { useMemo, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { InvoiceFilterModal } from "@/components/invoices/invoice-filter-modal"
import { InvoiceFilters } from "@/types"

interface InvoiceSearchFilterBarProps {
    searchTerm: string
    filters: InvoiceFilters
    setSearchTerm: (v: string) => void
    onReset: () => void
    setFilters: (v: InvoiceFilters) => void
}

export const InvoiceSearchFilterBar: React.FC<InvoiceSearchFilterBarProps> = ({
    searchTerm,
    filters,
    setFilters,
    setSearchTerm,
    onReset,
}) => {
    const { t } = useLanguage()
    const [showFilterModal, setShowFilterModal] = useState(false)
    const activeFiltersCount = useMemo(() => Object.keys(filters).filter(key =>
        key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder' &&
        filters[key as keyof typeof filters] !== undefined && filters[key as keyof typeof filters] !== ""
    ).length, [filters])

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder={t("invoices.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowFilterModal(true)} className="relative">
                    <Filter className="mr-2 h-4 w-4" />
                    {t("invoices.filter")}
                    {activeFiltersCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs justify-center">{activeFiltersCount}</Badge>
                    )}
                </Button>
                {activeFiltersCount > 0 && (
                    <Button variant="ghost" onClick={onReset} size="sm">
                        {t("invoices.removeFilter")}
                    </Button>
                )}
            </div>

            <InvoiceFilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={setFilters}
                currentFilters={filters}
            />
        </div>
    )
}
