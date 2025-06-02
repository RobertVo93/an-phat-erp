"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Collection } from "@/types/collection"

interface CollectionDeleteModalProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function CollectionDeleteModal({ collection, open, onOpenChange, onConfirm }: CollectionDeleteModalProps) {
  if (!collection) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Xác Nhận Xóa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa bộ sưu tập <strong>"{collection.name}"</strong> không?
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              ⚠️ Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm}>
            Xóa Bộ Sưu Tập
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
