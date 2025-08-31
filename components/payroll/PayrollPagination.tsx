import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"

interface PayrollPaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalRecords: number
  setCurrentPage: (page: number) => void
  setItemsPerPage: (n: number) => void
}

export const PayrollPagination: React.FC<PayrollPaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalRecords,
  setCurrentPage,
  setItemsPerPage,
}) => {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col items-center justify-between space-y-4 pb-4 sm:flex-row sm:space-y-0">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>
          {t("payroll.pagination.showing")} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalRecords)} {t("payroll.pagination.of")} {totalRecords} {t("payroll.pagination.records")}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 {t("payroll.pagination.itemsPerPage")}</SelectItem>
            <SelectItem value="10">10 {t("payroll.pagination.itemsPerPage")}</SelectItem>
            <SelectItem value="20">20 {t("payroll.pagination.itemsPerPage")}</SelectItem>
            <SelectItem value="50">50 {t("payroll.pagination.itemsPerPage")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("payroll.pagination.previous")}
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            {t("payroll.pagination.next")}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
