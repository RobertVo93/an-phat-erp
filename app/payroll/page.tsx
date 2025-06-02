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
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { usePayroll } from "@/hooks/use-payroll"
import { PayrollFilterModal } from "@/components/payroll/payroll-filter-modal"
import { PayrollViewModal } from "@/components/payroll/payroll-view-modal"
import { PayrollDeleteModal } from "@/components/payroll/payroll-delete-modal"
import { useLanguage } from "@/contexts/language-context"
import type { PayrollRecord } from "@/types/payroll"

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
    deletePayrollRecord,
    stats,
    processAllPayrolls,
  } = usePayroll()

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const handleView = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsViewModalOpen(true)
  }

  const handleDelete = (record: PayrollRecord) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedRecord) {
      deletePayrollRecord(selectedRecord.id)
    }
  }

  const handleSort = (field: keyof PayrollRecord) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleProcessAll = () => {
    processAllPayrolls()
    // Show success message
    alert(t("payroll.messages.processSuccess"))
  }

  const handleExport = () => {
    // Export logic here
    alert(t("payroll.messages.exportSuccess"))
  }

  return (
    <ERPLayout>
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
                const [field, order] = value.split("-") as [keyof PayrollRecord, "asc" | "desc"]
                setSortBy(field)
                setSortOrder(order)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">
                  {t("payroll.sort.name")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="name-desc">
                  {t("payroll.sort.name")} ({t("payroll.sort.descending")})
                </SelectItem>
                <SelectItem value="department-asc">
                  {t("payroll.sort.department")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="department-desc">
                  {t("payroll.sort.department")} ({t("payroll.sort.descending")})
                </SelectItem>
                <SelectItem value="netSalary-asc">
                  {t("payroll.sort.netSalary")} ({t("payroll.sort.ascending")})
                </SelectItem>
                <SelectItem value="netSalary-desc">
                  {t("payroll.sort.netSalary")} ({t("payroll.sort.descending")})
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
              <p className="text-xs text-muted-foreground">January 2024</p>
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
                      <AvatarImage src="/placeholder.svg" alt={record.name} />
                      <AvatarFallback>{getInitials(record.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                        <h3 className="text-sm font-medium">{record.name}</h3>
                        <Badge className={getStatusColor(record.status)}>
                          {t(`payroll.status.${record.status.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {record.position} - {t(`payroll.departments.${record.department.toLowerCase()}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">{record.payPeriod}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-5 sm:gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.baseSalary")}</p>
                      <p className="font-medium">{formatCurrency(record.baseSalary)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.overtime")}</p>
                      <p className="font-medium text-green-600">+{formatCurrency(record.overtime)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.bonus")}</p>
                      <p className="font-medium text-green-600">+{formatCurrency(record.bonus)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.deductions")}</p>
                      <p className="font-medium text-red-600">-{formatCurrency(record.deductions)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">{t("payroll.netSalary")}</p>
                      <p className="font-bold text-lg">{formatCurrency(record.netSalary)}</p>
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
                      <DropdownMenuItem onClick={() => handleDelete(record)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("payroll.delete.confirm")}
                      </DropdownMenuItem>
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
      />

      <PayrollViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        payrollRecord={selectedRecord}
      />

      <PayrollDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        payrollRecord={selectedRecord}
      />
    </ERPLayout>
  )
}
