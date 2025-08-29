"use client"

import { ERPLayout } from "@/components/erp-layout"
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader"
import { AttendanceViewModeToggle } from "@/components/attendance/AttendanceViewModeToggle"
import { AttendanceSearchFilterBar } from "@/components/attendance/AttendanceSearchFilterBar"
import { AttendanceListCards } from "@/components/attendance/AttendanceListCards"
import { AttendanceServersideTable } from "@/components/attendance/AttendanceServersideTable"
import { TimesheetView } from "@/components/attendance/timesheet-view"
import { useAttendance } from "@/hooks/use-attendance"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { AttendanceFormModal } from "@/components/attendance/attendance-form-modal"
import { AttendanceViewModal } from "@/components/attendance/attendance-view-modal"
import { AttendanceFilterModal } from "@/components/attendance/attendance-filter-modal"
import { AttendanceDeleteModal } from "@/components/attendance/attendance-delete-modal"

export default function AttendancePage() {
  const {
    attendanceRecords,
    searchTerm,
    filters,
    viewMode,
    totalPages,
    totalRecords,
    timesheetData,
    activeEmployees,
    loading,
    currentMonth,
    currentYear,
    isFormModalOpen,
    isViewModalOpen,
    isFilterModalOpen,
    isDeleteModalOpen,
    selectedRecord,
    formMode,

    handleSort,
    setSearchTerm,
    setFilters,
    setViewMode,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    setCurrentMonth,
    setCurrentYear,
    handleAddRecord,
    handleEditRecord,
    handleViewRecord,
    handleDeleteRecord,
    handleResetFilters,
    handleExport,
    setIsFilterModalOpen,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    handleCellClick,
  } = useAttendance()

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <AttendanceHeader 
          onAdd={handleAddRecord} 
          currentYear={currentYear} 
          currentMonth={currentMonth} 
          onMonthChange={setCurrentMonth} 
          onYearChange={setCurrentYear} 
          onExport={handleExport}
        />
        <AttendanceViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        {viewMode === "timesheet" ? (
          <TimesheetView
            timesheetData={timesheetData}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onCellClick={handleCellClick}
          />
        ) : (
          <>
            <AttendanceSearchFilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filters={filters}
              itemsPerPage={filters.limit || 10}
              setItemsPerPage={(limit) => setFilters({ ...filters, limit })}
              onOpenFilter={() => setIsFilterModalOpen(true)}
              onReset={handleResetFilters}
            />
            <AttendanceListCards
              attendanceRecords={attendanceRecords}
              onView={handleViewRecord}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
            <AttendanceServersideTable
              data={attendanceRecords}
              total={totalRecords}
              currentPage={filters.page || 1}
              pageSize={filters.limit || 10}
              sortBy={filters.sortBy || "date"}
              sortOrder={filters.sortOrder || "desc"}
              onPageChange={(page) => setFilters({ ...filters, page })}
              onSort={handleSort}
              loading={loading}
              totalPages={totalPages}
              onView={handleViewRecord}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          </>
        )}
        <AttendanceFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={addAttendanceRecord}
          onUpdate={updateAttendanceRecord}
          record={selectedRecord!}
          mode={formMode}
          employees={activeEmployees}
        />
        <AttendanceViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          record={selectedRecord}
        />
        <AttendanceFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={setFilters}
          currentFilters={filters}
          employees={activeEmployees}
        />
        <AttendanceDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => selectedRecord && deleteAttendanceRecord(selectedRecord.id!)}
          record={selectedRecord}
        />
      </div>
    </ERPLayout>
  )
}
