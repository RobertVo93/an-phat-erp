"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAttendance } from "@/hooks/use-attendance"
import { AttendanceFormModal } from "@/components/attendance/attendance-form-modal"
import { AttendanceViewModal } from "@/components/attendance/attendance-view-modal"
import { AttendanceFilterModal } from "@/components/attendance/attendance-filter-modal"
import { AttendanceDeleteModal } from "@/components/attendance/attendance-delete-modal"
import { TimesheetView } from "@/components/attendance/timesheet-view"
import {
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  List,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react"
import type { AttendanceRecord } from "@/types/attendance"

export default function AttendancePage() {
  const { t } = useLanguage()
  const {
    attendanceRecords,
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
    viewMode,
    setViewMode,
    totalPages,
    totalRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getAttendanceRecord,
    stats,
    timesheetData,
    employees,
    getEmployeeById,
  } = useAttendance()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const handleAddRecord = () => {
    setFormMode("create")
    setSelectedRecord(null)
    setIsFormModalOpen(true)
  }

  const handleEditRecord = (record: AttendanceRecord) => {
    setFormMode("edit")
    setSelectedRecord(record)
    setIsFormModalOpen(true)
  }

  const handleViewRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsViewModalOpen(true)
  }

  const handleDeleteRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedRecord) {
      deleteAttendanceRecord(selectedRecord.id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800"
      case "Late":
        return "bg-yellow-100 text-yellow-800"
      case "Absent":
        return "bg-red-100 text-red-800"
      case "Half Day":
        return "bg-blue-100 text-blue-800"
      case "Overtime":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "Morning":
        return "bg-orange-100 text-orange-800"
      case "Afternoon":
        return "bg-blue-100 text-blue-800"
      case "Evening":
        return "bg-indigo-100 text-indigo-800"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleSort = (field: keyof AttendanceRecord) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleTimesheetSave = () => {
    // Implementation for saving timesheet changes
    console.log("Saving timesheet...")
  }

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("attendance.title")}</h2>
            <p className="text-muted-foreground">{t("attendance.description")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date().toLocaleDateString("vi-VN")}
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleAddRecord}>
              <Plus className="mr-2 h-4 w-4" />
              {t("attendance.addRecord")}
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="mr-2 h-4 w-4" />
              {t("attendance.listView")}
            </Button>
            <Button
              variant={viewMode === "timesheet" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timesheet")}
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              {t("attendance.timesheetView")}
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            {t("attendance.export")}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("attendance.totalPresent")}</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPresent}</div>
              <p className="text-xs text-muted-foreground">{t("attendance.employeesPresent")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("attendance.totalAbsent")}</CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAbsent}</div>
              <p className="text-xs text-muted-foreground">{t("attendance.employeesAbsent")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("attendance.totalLate")}</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLate}</div>
              <p className="text-xs text-muted-foreground">{t("attendance.lateToday")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("attendance.totalOvertimeHours")}</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOvertimeHours.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">{t("attendance.totalOvertimeToday")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("attendance.totalWages")}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalWages.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{t("attendance.totalWagesToday")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        {viewMode === "list" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t("attendance.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="flex-1 sm:flex-none">
                <Filter className="mr-2 h-4 w-4" />
                {t("attendance.filter")}
              </Button>
              <Select value={`${itemsPerPage}`} onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === "timesheet" ? (
          <TimesheetView
            timesheetData={timesheetData}
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={setCurrentMonth}
            onYearChange={setCurrentYear}
            onSave={handleTimesheetSave}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t("attendance.title")}</CardTitle>
              <CardDescription>
                {t("attendance.pagination.showing")} {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, totalRecords)} {t("attendance.pagination.of")} {totalRecords}{" "}
                {t("attendance.pagination.records")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile Card View */}
              <div className="space-y-4 md:hidden">
                {attendanceRecords.map((record) => (
                  <Card key={record.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt={record.employeeName} />
                          <AvatarFallback>{getInitials(record.employeeName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{record.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">{record.employeeId}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRecord(record)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("attendance.view")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("attendance.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRecord(record)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("attendance.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t("attendance.date")}</p>
                        <p className="font-medium">{formatDate(record.date)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("attendance.shift")}</p>
                        <Badge className={getShiftColor(record.shift)}>
                          {t(`attendance.shift.${record.shift.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("attendance.status")}</p>
                        <Badge className={getStatusColor(record.status)}>
                          {t(`attendance.status.${record.status.toLowerCase().replace(" ", "")}`)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("attendance.dailyWage")}</p>
                        <p className="font-medium">${record.dailyWage.toFixed(2)}</p>
                      </div>
                    </div>

                    {(record.checkIn || record.checkOut) && (
                      <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t">
                        {record.checkIn && (
                          <div>
                            <p className="text-muted-foreground">{t("attendance.checkIn")}</p>
                            <p className="font-medium">{record.checkIn}</p>
                          </div>
                        )}
                        {record.checkOut && (
                          <div>
                            <p className="text-muted-foreground">{t("attendance.checkOut")}</p>
                            <p className="font-medium">{record.checkOut}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t">
                      <div>
                        <p className="text-muted-foreground">{t("attendance.workHours")}</p>
                        <p className="font-medium">{record.workHours}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t("attendance.overtime")}</p>
                        <p className="font-medium">{record.overtimeHours}h</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 cursor-pointer" onClick={() => handleSort("employeeName")}>
                        {t("attendance.employee")}
                        {sortBy === "employeeName" && (sortOrder === "asc" ? " ↑" : " ↓")}
                      </th>
                      <th className="text-left p-2 cursor-pointer" onClick={() => handleSort("date")}>
                        {t("attendance.date")}
                        {sortBy === "date" && (sortOrder === "asc" ? " ↑" : " ↓")}
                      </th>
                      <th className="text-left p-2">{t("attendance.shift")}</th>
                      <th className="text-left p-2">{t("attendance.checkIn")}</th>
                      <th className="text-left p-2">{t("attendance.checkOut")}</th>
                      <th className="text-left p-2">{t("attendance.workHours")}</th>
                      <th className="text-left p-2">{t("attendance.overtime")}</th>
                      <th className="text-left p-2">{t("attendance.dailyWage")}</th>
                      <th className="text-left p-2">{t("attendance.status")}</th>
                      <th className="text-left p-2">{t("attendance.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt={record.employeeName} />
                              <AvatarFallback className="text-xs">{getInitials(record.employeeName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{record.employeeName}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-sm">{formatDate(record.date)}</td>
                        <td className="p-2">
                          <Badge className={getShiftColor(record.shift)} variant="secondary">
                            {t(`attendance.shift.${record.shift.toLowerCase()}`)}
                          </Badge>
                        </td>
                        <td className="p-2 text-sm">{record.checkIn || "-"}</td>
                        <td className="p-2 text-sm">{record.checkOut || "-"}</td>
                        <td className="p-2 text-sm">{record.workHours}h</td>
                        <td className="p-2 text-sm">{record.overtimeHours}h</td>
                        <td className="p-2 text-sm">${record.dailyWage.toFixed(2)}</td>
                        <td className="p-2">
                          <Badge className={getStatusColor(record.status)}>
                            {t(`attendance.status.${record.status.toLowerCase().replace(" ", "")}`)}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewRecord(record)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t("attendance.view")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditRecord(record)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("attendance.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteRecord(record)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("attendance.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    {t("attendance.pagination.showing")} {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalRecords)} {t("attendance.pagination.of")} {totalRecords}{" "}
                    {t("attendance.pagination.records")}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t("attendance.pagination.previous")}
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      {t("attendance.pagination.next")}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <AttendanceFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={addAttendanceRecord}
          onUpdate={updateAttendanceRecord}
          record={selectedRecord}
          mode={formMode}
          employees={employees}
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
          employees={employees}
        />

        <AttendanceDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          record={selectedRecord}
        />
      </div>
    </ERPLayout>
  )
}
