"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useWarehouses } from "@/hooks/use-warehouses"
import { WarehouseFormModal } from "@/components/warehouses/warehouse-form-modal"
import { WarehouseViewModal } from "@/components/warehouses/warehouse-view-modal"
import { WarehouseFilterModal } from "@/components/warehouses/warehouse-filter-modal"
import { WarehouseDeleteModal } from "@/components/warehouses/warehouse-delete-modal"
import type { Warehouse } from "@/types/warehouse"

export default function WarehousePage() {
  const { t } = useLanguage()
  const {
    warehouses,
    allWarehouses,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useWarehouses()

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Distribution Center":
        return "bg-blue-100 text-blue-800"
      case "Regional Hub":
        return "bg-purple-100 text-purple-800"
      case "Cold Storage":
        return "bg-cyan-100 text-cyan-800"
      case "Backup Storage":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const calculateUtilization = (occupied: number, capacity: number) => {
    return Math.round((occupied / capacity) * 100)
  }

  const handleCreateWarehouse = () => {
    setFormMode("create")
    setSelectedWarehouse(null)
    setIsFormModalOpen(true)
  }

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setFormMode("edit")
    setSelectedWarehouse(warehouse)
    setIsFormModalOpen(true)
  }

  const handleViewWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    setIsViewModalOpen(true)
  }

  const handleDeleteWarehouse = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedWarehouse) {
      deleteWarehouse(selectedWarehouse.id)
      setIsDeleteModalOpen(false)
      setSelectedWarehouse(null)
    }
  }

  // Calculate statistics
  const totalCapacity = allWarehouses.reduce((sum, wh) => sum + wh.capacity, 0)
  const totalOccupied = allWarehouses.reduce((sum, wh) => sum + wh.occupied, 0)
  const avgUtilization =
    allWarehouses.length > 0
      ? Math.round(
          allWarehouses.reduce((sum, wh) => sum + calculateUtilization(wh.occupied, wh.capacity), 0) /
            allWarehouses.length,
        )
      : 0

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("warehouse.title")}</h2>
            <p className="text-muted-foreground">{t("warehouse.description")}</p>
          </div>
          <Button onClick={handleCreateWarehouse}>
            <Plus className="mr-2 h-4 w-4" />
            {t("warehouse.addWarehouse")}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("warehouse.searchPlaceholder")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsFilterModalOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              {t("warehouse.filter")}
            </Button>
            <Select
              value={`${sortOption.field}-${sortOption.direction}`}
              onValueChange={(value) => {
                const [field, direction] = value.split("-")
                setSortOption({ field: field as keyof Warehouse, direction: direction as "asc" | "desc" })
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">
                  {t("warehouse.sortBy.name")} - {t("warehouse.ascending")}
                </SelectItem>
                <SelectItem value="name-desc">
                  {t("warehouse.sortBy.name")} - {t("warehouse.descending")}
                </SelectItem>
                <SelectItem value="location-asc">
                  {t("warehouse.sortBy.location")} - {t("warehouse.ascending")}
                </SelectItem>
                <SelectItem value="location-desc">
                  {t("warehouse.sortBy.location")} - {t("warehouse.descending")}
                </SelectItem>
                <SelectItem value="capacity-asc">
                  {t("warehouse.sortBy.capacity")} - {t("warehouse.ascending")}
                </SelectItem>
                <SelectItem value="capacity-desc">
                  {t("warehouse.sortBy.capacity")} - {t("warehouse.descending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("warehouse.totalWarehouses")}</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allWarehouses.length}</div>
              <p className="text-xs text-muted-foreground">{t("warehouse.facilitiesManaged")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("warehouse.totalCapacity")}</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{t("warehouse.squareMeters")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("warehouse.occupiedSpace")}</CardTitle>
              <Package className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOccupied.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{t("warehouse.squareMeters")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("warehouse.avgUtilization")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgUtilization}%</div>
              <p className="text-xs text-muted-foreground">{t("warehouse.capacityUsed")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Warehouses List */}
        <Card>
          <CardHeader>
            <CardTitle>{t("warehouse.facilities")}</CardTitle>
            <CardDescription>{t("warehouse.facilitiesOverview")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouses.map((warehouse) => {
                const utilization = calculateUtilization(warehouse.occupied, warehouse.capacity)
                return (
                  <div
                    key={warehouse.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-4 lg:space-y-0"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-sm font-medium">{warehouse.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(warehouse.status)}>
                            {t(`warehouse.status.${warehouse.status}`)}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(warehouse.type)}>
                            {t(`warehouse.type.${warehouse.type.replace(/\s+/g, "")}`)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{warehouse.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{warehouse.address}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {t("warehouse.manager")}: {warehouse.manager}
                        </span>
                        <span>
                          {warehouse.zones} {t("warehouse.zones")}
                        </span>
                        <span>{t(`warehouse.temperature.${warehouse.temperature}`)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className={`font-bold ${getUtilizationColor(utilization)}`}>{utilization}%</span>
                          <span className="text-muted-foreground"> {t("warehouse.utilized")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {warehouse.occupied.toLocaleString()} / {warehouse.capacity.toLocaleString()} m²
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              utilization >= 90 ? "bg-red-500" : utilization >= 75 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewWarehouse(warehouse)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t("warehouse.viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditWarehouse(warehouse)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("warehouse.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteWarehouse(warehouse)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("warehouse.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{t("warehouse.itemsPerPage")}:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
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
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {t("warehouse.previous")}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t("warehouse.page")} {currentPage} {t("warehouse.of")} {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("warehouse.next")}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <WarehouseFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={addWarehouse}
          onUpdate={updateWarehouse}
          warehouse={selectedWarehouse}
          mode={formMode}
        />

        <WarehouseViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          warehouse={selectedWarehouse}
        />

        <WarehouseFilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <WarehouseDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          warehouse={selectedWarehouse}
        />
      </div>
    </ERPLayout>
  )
}
