"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, ProductFormData, ProductTierPrice } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, X } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import { Collection } from "@/types/collection"
import { ProductStatus, ProductUnit } from "@/types/enums";
import { normalizeTierPrices } from "@/lib/product-pricing"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { formatNumberWithCommas, parseSystemNumberInput } from "@/lib/utils"

interface ProductFormModalProps {
  product?: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProductFormData) => Promise<void>
  loading?: boolean
  allCollections: Collection[]
}

type ProductTierPriceForm = Omit<ProductTierPrice, "price"> & {
  price?: number
}

type ProductFormState = Omit<ProductFormData, "tierPrices"> & {
  tierPrices?: ProductTierPriceForm[]
}

export function ProductFormModal({ product, open, onOpenChange, onSubmit, loading, allCollections }: ProductFormModalProps) {
  const { t } = useLanguage()
  const isEdit = !!product

  const [formData, setFormData] = useState<ProductFormState>({
    name: "",
    unit: ProductUnit.other,
    description: "",
    price: 0,
    tierPrices: normalizeTierPrices(undefined, 0),
    cost: 0,
    stock: 0,
    minStock: 0,
    barcode: "",
    status: ProductStatus.active,
    supplier: "",
    image: "",
    subImages: [],
    collections: [],
  })
  const priceRef = useRef(formData.price ?? 0)
  const costRef = useRef(formData.cost ?? 0)
  const stockRef = useRef(formData.stock ?? 0)
  const minStockRef = useRef(formData.minStock ?? 0)
  const [tierPriceError, setTierPriceError] = useState("")
  const lastTier = (formData.tierPrices || [])[(formData.tierPrices || []).length - 1]
  const cannotAddTierPrice = Boolean(
    lastTier && (lastTier.maxQuantity === undefined || lastTier.maxQuantity <= lastTier.minQuantity)
  )
  const numberInputMax = Number.MAX_SAFE_INTEGER

  const syncQuantityRefs = (data: ProductFormState) => {
    priceRef.current = data.price ?? 0
    costRef.current = data.cost ?? 0
    stockRef.current = data.stock ?? 0
    minStockRef.current = data.minStock ?? 0
  }

  const normalizeFormTierPrices = (
    tierPrices?: ProductTierPriceForm[],
    productPrice = 0,
  ): ProductTierPriceForm[] => {
    const sourceTiers = tierPrices && tierPrices.length > 0
      ? tierPrices
      : normalizeTierPrices(undefined, productPrice)
    const hasOrder = sourceTiers.every((tier) => typeof tier.order === "number")
    const orderedTiers = sourceTiers.slice().sort((a, b) => {
      if (hasOrder) return a.order - b.order

      return a.minQuantity - b.minQuantity
    })

    return orderedTiers.map((tier, index) => {
      const previousTier = orderedTiers[index - 1]
      const minQuantity = index === 0
        ? 1
        : previousTier?.maxQuantity !== undefined
          ? previousTier.maxQuantity + 1
          : tier.minQuantity

      return {
        ...tier,
        minQuantity,
        order: index + 1,
      }
    })
  }

  const updateProductPrice = (price: number) => {
    priceRef.current = price
    setFormData((prev) => {
      const shouldSyncDefaultTierPrice = (prev.tierPrices?.[0]?.price ?? prev.price ?? 0) === (prev.price ?? 0)

      return {
        ...prev,
        price,
        tierPrices: normalizeFormTierPrices(prev.tierPrices, price).map((tier, index) => (
          index === 0 && shouldSyncDefaultTierPrice ? { ...tier, price } : tier
        )),
      }
    })
  }

  const updateCost = (cost: number) => {
    costRef.current = cost
    setFormData((prev) => ({ ...prev, cost }))
  }

  const updateStock = (stock: number) => {
    stockRef.current = stock
    setFormData((prev) => ({ ...prev, stock }))
  }

  const updateMinStock = (minStock: number) => {
    minStockRef.current = minStock
    setFormData((prev) => ({ ...prev, minStock }))
  }

  const updateSubImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      subImages: (prev.subImages || []).map((image, imageIndex) => (
        imageIndex === index ? value : image
      )),
    }))
  }

  const addSubImage = () => {
    setFormData((prev) => ({
      ...prev,
      subImages: [...(prev.subImages || []), ""],
    }))
  }

  const removeSubImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subImages: (prev.subImages || []).filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  const addTierPrice = () => {
    setFormData((prev) => {
      const tiers = normalizeFormTierPrices(prev.tierPrices, prev.price || 0)
      const lastTier = tiers[tiers.length - 1]
      const nextMinQuantity = lastTier?.maxQuantity !== undefined ? lastTier.maxQuantity + 1 : undefined

      if (nextMinQuantity === undefined) return prev

      return {
        ...prev,
        tierPrices: normalizeFormTierPrices([
          ...tiers,
          {
            minQuantity: nextMinQuantity,
            price: undefined,
            order: tiers.length + 1,
          },
        ], prev.price || 0),
      }
    })
  }

  const updateTierPrice = (
    index: number,
    field: "minQuantity" | "maxQuantity" | "price",
    value: number | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      tierPrices: normalizeFormTierPrices((prev.tierPrices || []).map((tier, tierIndex) => {
        if (tierIndex !== index) return tier

        return { ...tier, [field]: value }
      }), prev.price || 0),
    }))
  }

  const removeTierPrice = (index: number) => {
    if (index === 0) return

    setFormData((prev) => ({
      ...prev,
      tierPrices: normalizeFormTierPrices((prev.tierPrices || []).filter((_, tierIndex) => tierIndex !== index), prev.price || 0),
    }))
  }

  const selectCollection = (collectionId: string) => {
    const collections = formData.collections ?? [];

    const exists = collections.some((col) => col.id === collectionId);
    const updated = exists
      ? collections.filter((col) => col.id !== collectionId)
      : [...collections, allCollections.find((col) => col.id === collectionId)!];

    setFormData((prev) => ({
      ...prev,
      collections: updated,
    }));
  };


  useEffect(() => {
    if (product) {
      const nextFormData = {
        name: product.name,
        unit: product.unit,
        description: product.description,
        price: product.price || 0,
        tierPrices: normalizeTierPrices(product.tierPrices, product.price || 0),
        cost: product.cost || 0,
        stock: product.stock || 0,
        minStock: product.minStock || 0,
        barcode: product.barcode,
        status: product.status,
        supplier: product.supplier,
        image: product.image,
        subImages: product.subImages || [],
        collections: product.collections || [],
      }
      syncQuantityRefs(nextFormData)
      setFormData(nextFormData)
    } else {
      const nextFormData = {
        name: "",
        unit: ProductUnit.other,
        description: "",
        price: 0,
        tierPrices: normalizeTierPrices(undefined, 0),
        cost: 0,
        stock: 0,
        minStock: 0,
        barcode: "",
        status: ProductStatus.active,
        supplier: "",
        image: "",
        subImages: [],
        collections: [],
      }
      syncQuantityRefs(nextFormData)
      setFormData(nextFormData)
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    const currentFormData = {
      ...formData,
      price: priceRef.current,
      cost: costRef.current,
      stock: stockRef.current,
      minStock: minStockRef.current,
    }
    const tierPrices = normalizeFormTierPrices(currentFormData.tierPrices, currentFormData.price || 0)
    const invalidTier = tierPrices.find((tier, index) => (
      (tier.maxQuantity !== undefined && tier.maxQuantity <= tier.minQuantity)
      || (index < tierPrices.length - 1 && tier.maxQuantity === undefined)
      || tier.price === undefined
    ))

    if (invalidTier) {
      setTierPriceError(t("products.form.tierPriceRangeError"))
      return
    }

    setTierPriceError("")
    await onSubmit({
      ...currentFormData,
      tierPrices: tierPrices.map((tier) => ({
        ...tier,
        price: tier.price!,
      })),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? t("products.editProduct") : t("products.addProduct")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">{t("products.form.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2 col-span-1">
              <Label htmlFor="unit">{t("products.form.unit")} *</Label>
              <Select
                required
                value={formData.unit}
                onValueChange={(value: ProductUnit) => setFormData((prev) => ({...prev, unit: value}))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("products.form.selectUnit")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ProductUnit).map((unit, index) => (
                    <SelectItem key={index} value={unit}>
                      {t(`products.form.${unit}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t("products.form.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
            label={t("products.form.image")}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label>{t("products.form.subImages")}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubImage}>
                {t("products.form.addSubImage")}
              </Button>
            </div>

            {(formData.subImages || []).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(formData.subImages || []).map((subImage, index) => (
                  <div key={index} className="relative rounded-lg border p-3">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute right-2 top-2 z-10 h-8 w-8 p-0"
                      onClick={() => removeSubImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <ImageUpload
                      value={subImage}
                      onChange={(value) => updateSubImage(index, value)}
                      label={`${t("products.form.subImage")} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("products.form.noSubImages")}</p>
            )}
          </div>

          {/* Collections and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("products.form.collections")} *</Label>
              <Select
                required
                value=""
                onValueChange={(value) => selectCollection(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("products.form.selectCollections")} />
                </SelectTrigger>
                <SelectContent>
                  {allCollections && allCollections.map((collection) => (
                    <SelectItem key={collection.id!} value={collection.id!}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Display selected categories */}
              {formData?.collections?.length && formData?.collections?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.collections.map((collection) => {
                    return (
                      <div
                        key={collection.id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{collection.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              collections: prev.collections?.filter((c) => c.id !== collection.id),
                            }))
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

            </div>
            <div className="space-y-2">
              <Label>{t("products.form.status")} *</Label>
              <Select
                required
                value={formData.status}
                onValueChange={(value: ProductStatus) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductStatus.active}>{t("products.status.active")}</SelectItem>
                  <SelectItem value={ProductStatus.lowStock}>{t("products.status.lowStock")}</SelectItem>
                  <SelectItem value={ProductStatus.outOfStock}>{t("products.status.outOfStock")}</SelectItem>
                  <SelectItem value={ProductStatus.inactive}>{t("products.status.inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">{t("products.form.price")} *</Label>
              <QuantitySelector
                id="price"
                quantity={formData.price ?? 0}
                min={0}
                max={numberInputMax}
                showAction={false}
                onQuantityChange={updateProductPrice}
                inputClassName="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">{t("products.form.cost")} *</Label>
              <QuantitySelector
                id="cost"
                quantity={formData.cost ?? 0}
                min={0}
                max={numberInputMax}
                showAction={false}
                onQuantityChange={updateCost}
                inputClassName="text-left"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label>{t("products.form.tierPrices")}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTierPrice} disabled={cannotAddTierPrice}>
                {t("products.form.addTierPrice")}
              </Button>
            </div>

            {(formData.tierPrices || []).length > 0 ? (
              <div className="space-y-3">
                {(formData.tierPrices || []).map((tier, index) => (
                  <div key={index} className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-[80px_1fr_1fr_1fr_auto] md:items-end">
                    <div className="space-y-2">
                      <Label>{t("products.form.tierOrder")}</Label>
                      <QuantitySelector
                        quantity={tier.order}
                        min={1}
                        max={numberInputMax}
                        showAction={false}
                        disabled
                        onQuantityChange={() => undefined}
                        inputClassName="bg-gray-100 text-left"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("products.form.minQuantity")}</Label>
                      <QuantitySelector
                        quantity={tier.minQuantity}
                        min={1}
                        max={numberInputMax}
                        showAction={false}
                        disabled
                        onQuantityChange={() => undefined}
                        inputClassName="bg-gray-100 text-left"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("products.form.maxQuantity")}</Label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatNumberWithCommas(tier.maxQuantity)}
                        onChange={(e) => updateTierPrice(
                          index,
                          "maxQuantity",
                          e.target.value.trim() ? parseSystemNumberInput(e.target.value) : undefined,
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("products.form.tierPrice")}</Label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={formatNumberWithCommas(tier.price)}
                        onChange={(e) => updateTierPrice(
                          index,
                          "price",
                          e.target.value.trim() ? parseSystemNumberInput(e.target.value) : undefined,
                        )}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => removeTierPrice(index)}
                      disabled={index === 0}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("products.form.noTierPrices")}</p>
            )}
            {tierPriceError && (
              <p className="text-sm text-red-500">{tierPriceError}</p>
            )}
          </div>

          {/* Stock Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">{t("products.form.stock")}</Label>
              <QuantitySelector
                id="stock"
                quantity={formData.stock ?? 0}
                min={0}
                max={numberInputMax}
                showAction={false}
                onQuantityChange={updateStock}
                inputClassName="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">{t("products.form.minStock")}</Label>
              <QuantitySelector
                id="minStock"
                quantity={formData.minStock ?? 0}
                min={0}
                max={numberInputMax}
                showAction={false}
                onQuantityChange={updateMinStock}
                inputClassName="text-left"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? t("common.update") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
