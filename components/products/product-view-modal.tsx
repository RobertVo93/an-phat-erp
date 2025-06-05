"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import { formatCurrency } from "@/lib/utils"

interface ProductViewModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductViewModal({ product, open, onOpenChange }: ProductViewModalProps) {
  const { t } = useLanguage()

  if (!product) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "lowStock":
        return "bg-yellow-100 text-yellow-800"
      case "outOfStock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    return t(`products.status.${status}`)
  }

  const getCategoryText = (category: string) => {
    return t(`products.category.${category}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("products.viewProduct")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400 text-sm">{t("products.noImage")}</span>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.name")}</label>
              <p className="text-lg font-semibold">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.sku")}</label>
              <p className="font-mono">{product.sku}</p>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.description")}</label>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {/* Category and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.collections")}</label>
              {product.collections &&
                <div>
                  {product.collections?.map((col, ind) => (
                    <p key={ind}>
                      {col.name}
                    </p>
                  ))}
                </div>
              }
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.status")}</label>
              <Badge className={getStatusColor(product.status!)}>{getStatusText(product.status!)}</Badge>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.price")}</label>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(product.price!)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.cost")}</label>
              <p className="text-lg">{formatCurrency(product.cost!)}</p>
            </div>
          </div>

          {/* Stock Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.stock")}</label>
              <p className="text-lg font-semibold">{product.stock}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">{t("products.form.minStock")}</label>
              <p>{product.minStock}</p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            {product.barcode && (
              <div>
                <label className="text-sm font-medium text-gray-500">{t("products.form.barcode")}</label>
                <p className="font-mono">{product.barcode}</p>
              </div>
            )}
            {product.supplier && (
              <div>
                <label className="text-sm font-medium text-gray-500">{t("products.form.supplier")}</label>
                <p>{product.supplier}</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <label className="font-medium">{t("products.createdAt")}</label>
              <p>{new Date(product.createdAt!).toLocaleString()}</p>
            </div>
            <div>
              <label className="font-medium">{t("products.updatedAt")}</label>
              <p>{new Date(product.updatedAt!).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
