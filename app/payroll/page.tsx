"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DollarSign,
  Download,
  Filter,
  Search,
  Calculator,
  FileText,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
} from "lucide-react"
import { usePayroll } from "@/hooks/use-payroll"
import { PayrollFilterModal } from "@/components/payroll/payroll-filter-modal"
import { PayrollViewModal } from "@/components/payroll/payroll-view-modal"
import { PayrollDeleteModal } from "@/components/payroll/payroll-delete-modal"
import { useLanguage } from "@/contexts/language-context"
import type { PayrollRecord, SortableKey } from "@/types/payroll"
import { PayrollStatus } from "@/types"
import { PayrollProcessOneModal } from "@/components/payroll/payroll-process-one-modal"
import { PayrollProcessAllModal } from "@/components/payroll/payroll-process-all-modal"

export default function PayrollPage() {
  const { t } = useLanguage()
  const {
    payrollRecords,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    totalPages,
    totalRecords,
    stats,
    processAllPayrolls,
    loading,
    filterPeriods,
    processOnePayroll
  } = usePayroll()

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isProcessOneModalOpen, setIsProcessOneModalOpen] = useState(false)
  const [isProcessAllModalOpen, setIsProcessAllModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case PayrollStatus.processed:
        return "bg-green-100 text-green-800"
      case PayrollStatus.pending:
        return "bg-yellow-100 text-yellow-800"
      case PayrollStatus.failed:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return ""
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} VND`
  }

  const handleView = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsViewModalOpen(true)
  }

  const handleConfirmProcess = () => {
    if (selectedRecord) {
      processOnePayroll(selectedRecord.id!)
    }
  }

  const handleProcessOne = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsProcessOneModalOpen(true)
  }

  const handleProcessAll = () => {
    setIsProcessAllModalOpen(true)
  }

  const handleConfirmProcessAll = () => {
    processAllPayrolls()
  }

  const handleExport = () => {
    // Export logic here
    alert(t("payroll.messages.exportSuccess"))
  }

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("payroll.title")}</h2>
            <p className="text-muted-foreground">{t("payroll.description")}</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button variant="outline" onClick={handleProcessAll} className="w-full sm:w-auto">
              <Calculator className="mr-2 h-4 w-4" />
              {t("payroll.processAll")}
            </Button>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              {t("payroll.exportPayroll")}
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("payroll.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("payroll.filter")}
            </Button>
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-") as [SortableKey, "asc" | "desc"]
                setSortBy(field)
                setSortOrder(order)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee.name-asc">
                  {t("payroll.sort.name")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="employee.name-desc">
                  {t("payroll.sort.name")} ({t("payroll.sort.descending")})
                </SelectItem>
                <SelectItem value="employee.department-asc">
                  {t("payroll.sort.department")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="employee.department-desc">
                  {t("payroll.sort.department")} ({t("payroll.sort.descending")})
                </SelectItem>
                <SelectItem value="totalSalary-asc">
                  {t("payroll.sort.totalSalary")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="totalSalary-desc">
                  {t("payroll.sort.totalSalary")} ({t("payroll.sort.descending")})
                </SelectItem>
                <SelectItem value="status-asc">
                  {t("payroll.sort.status")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="status-desc">
                  {t("payroll.sort.status")} ({t("payroll.sort.descending")})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("payroll.totalPayroll")}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalPayroll)}</div>
              {/* <p className="text-xs text-muted-foreground">January 2024</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("payroll.processed")}</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processedCount}</div>
              <p className="text-xs text-muted-foreground">
                {t("payroll.outOf")} {stats.processedCount + stats.pendingCount} {t("payroll.employees")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("payroll.pending")}</CardTitle>
              <Calculator className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs text-muted-foreground">{t("payroll.awaitingProcessing")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("payroll.averageSalary")}</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(Math.round(stats.averageSalary))}</div>
              <p className="text-xs text-muted-foreground">{t("payroll.perEmployee")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Payroll Records */}
        <Card>
          <CardHeader>
            <CardTitle>{t("payroll.payrollDetails")}</CardTitle>
            <CardDescription>{t("payroll.payrollDetailsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col space-y-4 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" alt={record.employee?.name!} />
                      <AvatarFallback>{getInitials(record.employee?.name!)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                        <h3 className="text-sm font-medium">{record.employee?.name!}</h3>
                        <Badge className={getStatusColor(record.status!)}>
                          {t(`payroll.status.${record.status?.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {record.employee?.position} - {t(`payroll.departments.${record.employee?.department!.toLowerCase()}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">{record.payPeriod}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5 sm:gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.baseSalary")}</p>
                      <p className="font-medium">{formatCurrency(record.employee?.salary!)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.workingShifts")}</p>
                      <p className="font-medium">{record.workingShifts}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.totalSalary")}</p>
                      <p className="font-bold text-lg">{formatCurrency(record.totalSalary!)}</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(record)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("payroll.viewPayroll")}
                      </DropdownMenuItem>
                      {record.status !== PayrollStatus.processed &&
                        <DropdownMenuItem onClick={() => handleProcessOne(record)} className="text-green-500">
                          <Check className="mr-2 h-4 w-4" />
                          {t("payroll.processPayroll")}
                        </DropdownMenuItem>
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between space-y-4 pt-4 sm:flex-row sm:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                  {t("payroll.pagination.showing")} {(currentPage - 1) * itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, totalRecords)} {t("payroll.pagination.of")} {totalRecords}{" "}
                  {t("payroll.pagination.records")}
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
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <PayrollFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
        filterPeriods={filterPeriods}
      />

      <PayrollViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        payrollRecord={selectedRecord}
      />

      <PayrollProcessOneModal
        isOpen={isProcessOneModalOpen}
        onClose={() => setIsProcessOneModalOpen(false)}
        onConfirm={handleConfirmProcess}
        payrollRecord={selectedRecord}
      />

      <PayrollProcessAllModal
        isOpen={isProcessAllModalOpen}
        onClose={() => setIsProcessAllModalOpen(false)}
        onConfirm={handleConfirmProcessAll}
      />
    </ERPLayout>
  )
}
