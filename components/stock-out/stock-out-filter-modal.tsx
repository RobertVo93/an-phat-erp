"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StockOutFilters } from "@/types/stock-out"
import { useLanguage } from "@/contexts/language-context"

interface StockOutFilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: StockOutFilters
  onFiltersChange: (filters: StockOutFilters) => void
}

const mockCustomers = [
  { id: "1", name: "Công ty TNHH Công nghệ ABC" },
  { id: "2", name: "Cửa hàng Điện tử XYZ" },
  { id: "3", name: "Siêu thị Điện máy DEF" },
]

const mockWarehouses = [
  { id: "1", name: "Kho Chính" },
  { id: "2", name: "Kho Phụ" },
  { id: "3", name: "Kho Chi Nhánh" },
]

export function StockOutFilterModal({ isOpen, onClose, filters, onFiltersChange }: StockOutFilterModalProps) {
  const { t } = useLanguage()

  const handleFilterChange = (key: keyof StockOutFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "",
      customerId: "",
      warehouseId: "",
      dateFrom: "",
      dateTo: "",
      amountFrom: "",
      amountTo: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("common.advancedFilter")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <Label htmlFor="status">{t("stockOut.filterByStatus")}</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allStatuses")}</SelectItem>
                <SelectItem value="draft">{t("stockOut.status.draft")}</SelectItem>
                <SelectItem value="processing">{t("stockOut.status.processing")}</SelectItem>
                <SelectItem value="shipped">{t("stockOut.status.shipped")}</SelectItem>
                <SelectItem value="delivered">{t("stockOut.status.delivered")}</SelectItem>
                <SelectItem value="cancelled">{t("stockOut.status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Filter */}
          <div>
            <Label htmlFor="customer">{t("stockOut.filterByCustomer")}</Label>
            <Select value={filters.customerId} onValueChange={(value) => handleFilterChange("customerId", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.allCustomers")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allCustomers")}</SelectItem>
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse Filter */}
          <div>
            <Label htmlFor="warehouse">{t("stockOut.filterByWarehouse")}</Label>
            <Select value={filters.warehouseId} onValueChange={(value) => handleFilterChange("warehouseId", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("common.allWarehouses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allWarehouses")}</SelectItem>
                {mockWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div>
            <Label>{t("stockOut.dateRange")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom" className="text-sm">
                  {t("common.from")}
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-sm">
                  {t("common.to")}
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <Label>{t("stockOut.amountRange")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amountFrom" className="text-sm">
                  {t("common.from")} (VND)
                </Label>
                <Input
                  id="amountFrom"
                  type="number"
                  min="0"
                  value={filters.amountFrom}
                  onChange={(e) => handleFilterChange("amountFrom", e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="amountTo" className="text-sm">
                  {t("common.to")} (VND)
                </Label>
                <Input
                  id="amountTo"
                  type="number"
                  min="0"
                  value={filters.amountTo}
                  onChange={(e) => handleFilterChange("amountTo", e.target.value)}
                  placeholder="999999999"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearFilters}>
              {t("common.clearFilters")}
            </Button>
            <Button onClick={onClose}>{t("common.applyFilters")}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
