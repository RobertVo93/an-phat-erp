"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import type { Collection } from "@/types/collection"

interface CollectionViewModalProps {
  collection: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CollectionViewModal({ collection, open, onOpenChange }: CollectionViewModalProps) {
  const { t } = useLanguage()

  if (!collection) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return t("collections.status.active")
      case "Draft":
        return t("collections.status.draft")
      case "Archived":
        return t("collections.status.archived")
      default:
        return status
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case "Fashion":
        return t("collections.category.fashion")
      case "Electronics":
        return t("collections.category.electronics")
      case "Home":
        return t("collections.category.home")
      case "Office":
        return t("collections.category.office")
      default:
        return category
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {collection.name}
            <Badge className={getStatusColor(collection.status)}>{getStatusText(collection.status)}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Collection Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Bộ Sưu Tập</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mã Bộ Sưu Tập</label>
                  <p className="text-sm font-mono">{collection.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Danh Mục</label>
                  <p className="text-sm">{getCategoryText(collection.category)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày Tạo</label>
                  <p className="text-sm">{collection.createdDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tổng Giá Trị</label>
                  <p className="text-sm font-semibold">{collection.totalValue}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mô Tả</label>
                <p className="text-sm">{collection.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Products in Collection */}
          <Card>
            <CardHeader>
              <CardTitle>Sản Phẩm Trong Bộ Sưu Tập ({collection.productCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {collection.products && collection.products.length > 0 ? (
                <div className="space-y-3">
                  {collection.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium">{product.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">${product.price}</p>
                        <p className="text-xs text-gray-500">Tồn kho: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có sản phẩm nào trong bộ sưu tập này</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
