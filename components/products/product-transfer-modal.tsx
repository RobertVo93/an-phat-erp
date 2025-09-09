"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Warehouse, Product, ITransferProduct } from "@/types"
import { useState } from "react"

interface Props {
  isOpen: boolean
  product: Product
  sourceWH: Warehouse
  availableQuantity: number
  warehouses: Warehouse[]
  onClose: () => void
  onSubmit: (data: ITransferProduct) => Promise<void>
}

export function ProductTransferModal({
  isOpen,
  product,
  sourceWH,
  availableQuantity,
  warehouses,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useLanguage()
  const [destinationWH, setDestinationWH] = useState<Warehouse>()
  const [quantity, setQuantity] = useState<number>(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!destinationWH) newErrors.destinationWH = t("products.modal.destinationRequired")
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    await onSubmit({ sourceWH, destinationWH, product, quantity })
    setDestinationWH(undefined)
    setQuantity(1)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setDestinationWH(undefined)
          setQuantity(1)
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("products.modal.transferProduct")}: {product?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* FROM */}
          <div className="flex flex-col">
            <Label className="font-bold">{t("warehouse.from")}:</Label>
            <span>{sourceWH?.name}</span>
            <span className="text-gray-500 text-sm">ID: {sourceWH?.number}</span>
          </div>

          {/* TO */}
          <div>
            <Label className="font-bold">{t("warehouse.to")}:</Label>
            <Select
              value={destinationWH?.id}
              onValueChange={(id) => {
                const wh = warehouses.find((w) => w.id === id)
                setDestinationWH(wh)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("warehouse.selectWarehouse")} />
              </SelectTrigger>
              <SelectContent>
                {warehouses
                  .filter((w) => w.id !== sourceWH?.id)
                  .map((w) => (
                    <SelectItem key={w.id} value={w.id!}>
                      {w.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {destinationWH && <span className="text-gray-500 text-sm">ID: {destinationWH.number}</span>}
            {errors.destinationWH && <p className="text-sm text-red-500">{errors.destinationWH}</p>}
          </div>

          {/* QUANTITY */}
          <div>
            <Label className="font-bold">{t("warehouse.quantity")}:</Label>
            <Input
              type="number"
              min={1}
              max={availableQuantity}
              value={quantity}
              onChange={(e) => {
                const val = Number(e.target.value)
                if (!isNaN(val)) setQuantity(Math.min(Math.max(val, 1), availableQuantity))
              }}
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
            <span className="text-gray-500 text-sm">
              {t("warehouse.availableQuantity")}: {availableQuantity} {t(`warehouse.table.${product?.unit}`)}
            </span>
          </div>

          {/* SUBMIT */}
          <div className="w-full flex justify-end">
            <Button variant="outline" onClick={handleSubmit} disabled={quantity > availableQuantity}>
              {t("warehouse.transfer")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
