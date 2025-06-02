"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import type { CollectionFilters } from "@/types/collection"

interface CollectionFilterModalProps {
  filters: CollectionFilters
  open: boolean
  onOpenChange: (open: boolean) => void
  onFiltersChange: (filters: CollectionFilters) => void
  onReset: () => void
}

export function CollectionFilterModal({
  filters,
  open,
  onOpenChange,
  onFiltersChange,
  onReset,
}: CollectionFilterModalProps) {
  const { t } = useLanguage()

  const handleApply = () => {
    onOpenChange(false)
  }

  const handleReset = () => {
    onReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bộ Lọc Bộ Sưu Tập</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Trạng Thái</Label>
            <Select value={filters.status} onValueChange={(value) => onFiltersChange({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Active">Hoạt Động</SelectItem>
                <SelectItem value="Draft">Bản Nháp</SelectItem>
                <SelectItem value="Archived">Đã Lưu Trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh Mục</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="Fashion">Thời Trang</SelectItem>
                <SelectItem value="Electronics">Điện Tử</SelectItem>
                <SelectItem value="Home">Gia Dụng</SelectItem>
                <SelectItem value="Office">Văn Phòng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Từ Ngày</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Đến Ngày</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleReset}>
            Đặt Lại
          </Button>
          <Button type="button" onClick={handleApply}>
            Áp Dụng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
