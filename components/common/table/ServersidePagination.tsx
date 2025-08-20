import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ServersidePaginationProps {
    currentPage: number
    totalPages: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
}

export const ServersidePagination: React.FC<ServersidePaginationProps> = ({
    currentPage,
    totalPages,
    pageSize,
    total,
    onPageChange,
}) => {
    const { t } = useLanguage()
    // Desktop pagination logic
    const pages = useMemo(() => {
        const result = []
        const maxVisiblePages = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }
        for (let i = startPage; i <= endPage; i++) {
            result.push(i)
        }
        return result
    }, [currentPage, totalPages])

    return (
        <div className="w-full">
            {/* Desktop */}
            <div className="hidden lg:flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {t("orders.pagination.showing")} {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)} {t("orders.pagination.of")} {total} {t("orders.pagination.results")}
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="h-4 w-4" />
                        {t("orders.pagination.previous")}
                    </Button>
                    {pages.map((i) => (
                        <Button key={i} variant={i === currentPage ? "default" : "outline"} size="sm" onClick={() => onPageChange(i)}>
                            {i}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        {t("orders.pagination.next")}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 lg:hidden">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                    {t("orders.pagination.showing")} {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, total)} {t("orders.pagination.of")} {total} {t("orders.pagination.results")}
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex-1 sm:flex-none">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        {t("orders.pagination.previous")}
                    </Button>
                    <div className="flex items-center space-x-1">
                        <span className="text-sm px-2">{currentPage}</span>
                        <span className="text-sm text-muted-foreground">/</span>
                        <span className="text-sm px-2">{totalPages}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex-1 sm:flex-none">
                        {t("orders.pagination.next")}
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
