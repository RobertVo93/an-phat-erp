"use client"

import React from "react"
import { MoreHorizontal, Eye, CheckCheck, Trash2 } from "lucide-react"
import { ERPLayout } from "@/components/erp-layout"
import { PayrollHeader } from "@/components/payroll/PayrollHeader"
import { PayrollStatsCards } from "@/components/payroll/PayrollStatsCards"
import { PayrollSearchFilterBar } from "@/components/payroll/PayrollSearchFilterBar"
import { usePayroll } from "@/hooks/use-payroll"
import type { PayrollRecord, PayrollSortableKey } from "@/types/payroll"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatLargeCurrency, getCustomerInitialCharacter, getPayrollStatusColor } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { PayrollViewModal } from "@/components/payroll/payroll-view-modal"
import { PayrollApproveModal } from "@/components/payroll/PayrollApproveModal"
import { PayrollList } from "@/components/payroll/PayrollList"
import { PayrollDeleteModal } from "@/components/payroll/payroll-delete-modal"
import { PayrollPagination } from "@/components/payroll/PayrollPagination"

export default function PayrollPage() {
  const { t } = useLanguage()
  const {
    searchTerm,
    payrollRecords,
    filters,
    totalRecords,
    stats,
    totalPages,
    loading,
    isViewModalOpen,
    isApproveModalOpen,
    selectedRecord,
    isDeleteModalOpen,
    selectedPayPeriod,

    setSelectedPayPeriod,
    setSearchTerm,
    setFilters,
    setIsViewModalOpen,
    setIsApproveModalOpen,
    setIsDeleteModalOpen,
    onApprovePayrollConfirm,
    handleView,
    onApprovePayroll,
    handleExport,
    handleSort,
    handleSyncPayroll,
    handleConfirmDelete,
    onDeleteClickHandler,
  } = usePayroll()

  const columns: ServersideTableColumn<PayrollRecord>[] = [
    {
      key: "employee.name",
      title: t("payroll.employee"),
      sortable: false,
      render: (record) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={record.employee?.name!} />
            <AvatarFallback>{getCustomerInitialCharacter(record.employee?.name!)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{record.employee?.number} - {record.employee?.name!}</p>
            <p className="text-xs text-muted-foreground">{record.employee?.position || "-"} - {record.employee?.department || "-"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "number",
      title: t("common.number"),
      sortable: true,
      render: (record) => record.number,
    },
    {
      key: "payPeriod",
      title: t("payroll.payPeriod"),
      sortable: true,
      render: (record) => record.payPeriod,
    },
    {
      key: "workingShifts",
      title: t("payroll.workingShifts"),
      sortable: true,
      render: (record) => record.workingShifts,
    },
    {
      key: "workingHours",
      title: t("payroll.workingHours"),
      sortable: true,
      render: (record) => record.workingHours,
    },
    {
      key: "totalSalary",
      title: t("payroll.totalSalary"),
      sortable: true,
      render: (record) => <span className="font-bold">{formatLargeCurrency(record.totalSalary!)}</span>,
    },
    {
      key: "status",
      title: t("payroll.status"),
      sortable: true,
      render: (record) => (
        <Badge className={getPayrollStatusColor(record.status!)}>
          {record.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (record) => (
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
            {record.status !== "processed" && (
              <DropdownMenuItem onClick={() => onApprovePayroll(record)} className="text-green-500">
                <CheckCheck className="mr-2 h-4 w-4" />
                {t("payroll.approvePayroll")}
              </DropdownMenuItem>
            )}
            {record.status !== "processed" && (
              <DropdownMenuItem onClick={() => onDeleteClickHandler(record)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("payroll.delete.confirm")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <PayrollHeader 
          payPeriod={selectedPayPeriod}
          onPayPeriodChange={setSelectedPayPeriod}
          onExport={handleExport} 
          onSyncPayroll={handleSyncPayroll} 
        />
        <PayrollStatsCards stats={stats} />
        <PayrollSearchFilterBar
          searchTerm={searchTerm}
          filter={filters}
          setSearchTerm={setSearchTerm}
          setFilter={setFilters}
          handleSort={handleSort}
        />
        <div className="hidden md:block">
          <ServersideTable
            columns={columns as ServersideTableColumn<{ id: string }>[]} 
            data={payrollRecords as { id: string }[]}
            total={totalRecords}
            currentPage={filters.page || 1}
            pageSize={filters.limit || 10}
            sortBy={filters.sortBy || "payPeriod"}
            sortOrder={filters.sortOrder || "asc"}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onSort={(field) => handleSort(field as PayrollSortableKey)}
            loading={loading}
            totalPages={totalPages}
          />
        </div>
        <div className="block md:hidden">
          <PayrollPagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            itemsPerPage={filters.limit || 10}
            totalRecords={totalRecords}
            setCurrentPage={(page) => setFilters({ ...filters, page })}
            setItemsPerPage={(limit) => setFilters({ ...filters, limit })}
          />
          <PayrollList
            payrollRecords={payrollRecords}
            onView={handleView}
            onApprove={onApprovePayroll}

          />
        </div>
        <PayrollViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          payrollRecord={selectedRecord}
        />
        <PayrollApproveModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={onApprovePayrollConfirm}
          payrollRecord={selectedRecord}
        />
        <PayrollDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          payrollRecord={selectedRecord}
        />
      </div>
    </ERPLayout>
  )
}
