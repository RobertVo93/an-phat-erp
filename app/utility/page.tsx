"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useUtilities } from "@/hooks/use-utilities"
import { UtilityFormModal } from "@/components/utilities/utility-form-modal"
import { UtilityViewModal } from "@/components/utilities/utility-view-modal"
import { UtilityFilterModal } from "@/components/utilities/utility-filter-modal"
import { UtilityDeleteModal } from "@/components/utilities/utility-delete-modal"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Zap,
  Droplets,
  Thermometer,
  Wifi,
  Phone,
  Tv,
  Shield,
  BrushIcon as Broom,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import type { Utility } from "@/types/utility"
import { UtilityStatus, UtilityType } from "@/types"

export default function UtilityPage() {
  const { t } = useLanguage()
  const {
    utilities,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortField,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    // totalItems,
    addUtility,
    updateUtility,
    deleteUtility,
    getUtilityById,
    resetFilters,
    stats,
    loading,
  } = useUtilities()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUtility, setSelectedUtility] = useState<Utility | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const getStatusColor = (status: string) => {
    switch (status) {
      case UtilityStatus.active:
        return "bg-green-100 text-green-800"
      case UtilityStatus.overdue:
        return "bg-red-100 text-red-800"
      case UtilityStatus.inactive:
        return "bg-yellow-100 text-yellow-800"
      case UtilityStatus.disconnected:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUtilityIcon = (type: UtilityType) => {
    switch (type.toLowerCase()) {
      case UtilityType.electricity:
        return Zap
      case UtilityType.water:
        return Droplets
      case UtilityType.gas:
        return Thermometer
      case UtilityType.internet:
        return Wifi
      case UtilityType.phone:
        return Phone
      case UtilityType.cable:
        return Tv
      case UtilityType.security:
        return Shield
      case UtilityType.cleaning:
        return Broom
      default:
        return Zap
    }
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const handleCreateUtility = () => {
    setFormMode("create")
    setSelectedUtility(null)
    setIsFormModalOpen(true)
  }

  const handleEditUtility = (utility: Utility) => {
    setFormMode("edit")
    setSelectedUtility(utility)
    setIsFormModalOpen(true)
  }

  const handleViewUtility = (utility: Utility) => {
    setSelectedUtility(utility)
    setIsViewModalOpen(true)
  }

  const handleDeleteUtility = (utility: Utility) => {
    setSelectedUtility(utility)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedUtility) {
      deleteUtility(selectedUtility.id!)
    }
  }

  const hasActiveFilters = Object.keys(filters).some((key) => filters[key as keyof typeof filters] !== undefined)

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("utilities.title")}</h2>
            <p className="text-muted-foreground">{t("utilities.detailDescription")}</p>
          </div>
          <Button onClick={handleCreateUtility} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("utilities.addUtility")}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("utilities.searchPlaceholder")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterModalOpen(true)}
              className={hasActiveFilters ? "border-blue-500 bg-blue-50" : ""}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t("utilities.filter")}
              {hasActiveFilters && <span className="ml-1 text-xs bg-blue-500 text-white rounded-full px-1">!</span>}
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" onClick={resetFilters}>
                {t("utilities.resetFilters")}
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("utilities.totalUtilities")}</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.totalUtilities}</div>
              <p className="text-xs text-muted-foreground">{t("utilities.services")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("utilities.activeUtilities")}</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.activeUtilities}</div>
              <p className="text-xs text-muted-foreground">{t("utilities.active")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("utilities.overdueUtilities")}</CardTitle>
              <Zap className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{stats.overdueUtilities}</div>
              <p className="text-xs text-muted-foreground">{t("utilities.overdue")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("utilities.totalMonthlyCost")}</CardTitle>
              <Zap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.totalMonthlyCost)}</div>
              <p className="text-xs text-muted-foreground">{t("utilities.monthly")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">{t("utilities.avgMonthlyCost")}</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.avgMonthlyCost)}</div>
              <p className="text-xs text-muted-foreground">{t("utilities.avgMonthly")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("utilities.sortBy")}:</span>
            <Select value={sortField} onValueChange={(value: any) => handleSort(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="type">{t("utilities.type")}</SelectItem>
                <SelectItem value="provider">{t("utilities.provider")}</SelectItem>
                <SelectItem value="location">{t("utilities.location")}</SelectItem>
                <SelectItem value="monthlyCost">{t("utilities.monthlyCost")}</SelectItem>
                <SelectItem value="dueDate">{t("utilities.dueDate")}</SelectItem>
                <SelectItem value="status">{t("utilities.status")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => handleSort(sortField)}>
              <ArrowUpDown className="h-4 w-4" />
              {sortDirection === "asc" ? t("utilities.ascending") : t("utilities.descending")}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {totalPages} {totalPages === 1 ? "utility" : "utilities"}
          </div>
        </div>

        {/* Utilities List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("utilities.title")}</CardTitle>
            <CardDescription>
              {totalPages > 0
                ? `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalPages)} of ${totalPages} utilities`
                : t("utilities.noUtilities")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {utilities.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t("utilities.noUtilities")}</h3>
                <p className="mt-1 text-sm text-gray-500">{t("utilities.noUtilitiesDescription")}</p>
                <div className="mt-6">
                  <Button onClick={handleCreateUtility}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("utilities.addUtility")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {utilities.map((utility) => {
                  const UtilityIcon = getUtilityIcon(utility.type!)
                  return (
                    <div
                      key={utility.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <UtilityIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="text-sm font-medium">{t(`utilities.${utility.type!.toLowerCase()}`)}</h3>
                            <Badge className={getStatusColor(utility.status!)}>
                              {t(`utilities.${utility.status!.toLowerCase()}`)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-muted-foreground">
                            <div>{t("utilities.provider")}: {utility.provider}</div>
                            <div>{t("utilities.account")}: {utility.accountNumber}</div>
                            <div>{t("utilities.location")}: {utility.location}</div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                            <span>
                              {t("utilities.usage")}: {utility.monthlyUsage} {t(`utilities.${utility.unit!.toLowerCase()}`)}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>
                              {t("utilities.rate")}: {formatCurrency(utility.costPerUnit!)}/{t(`utilities.${utility.unit!.toLowerCase()}`)}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{t("utilities.due")}: {utility.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="text-lg font-bold">{formatCurrency(utility.monthlyCost!)}</div>
                          <div className="text-xs text-muted-foreground">{t("utilities.monthlyCost")}</div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewUtility(utility)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("utilities.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUtility(utility)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("utilities.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUtility(utility)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("utilities.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("utilities.itemsPerPage")}:</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setCurrentPage(1)
                setItemsPerPage(Number(value))
              }}>
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                {t("utilities.previous")}
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
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
                {t("utilities.next")}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {t("utilities.page")} {currentPage} {t("utilities.of")} {totalPages}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UtilityFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={addUtility}
        onUpdate={updateUtility}
        utility={selectedUtility!}
        mode={formMode}
      />

      <UtilityViewModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} utility={selectedUtility} />

      <UtilityFilterModal
        utilities={utilities}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />

      <UtilityDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        utility={selectedUtility}
      />
    </ERPLayout>
  )
}
