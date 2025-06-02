"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, AlertTriangle } from "lucide-react"

interface ProductDeleteModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  loading?: boolean
}

export function ProductDeleteModal({ product, open, onOpenChange, onConfirm, loading }: ProductDeleteModalProps) {
  const { t } = useLanguage()

  if (!product) return null

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>{t("products.deleteProduct")}</DialogTitle>
              <DialogDescription>{t("products.deleteConfirmation")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 bg-gray-50">
            <div className="space-y-2">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">
                {t("products.form.sku")}: {product.sku}
              </p>
              <p className="text-sm text-gray-600">
                {t("products.form.stock")}: {product.stock}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">{t("products.deleteWarning")}</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button type="button" variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
