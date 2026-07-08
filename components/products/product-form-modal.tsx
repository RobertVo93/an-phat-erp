"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, ProductFormData } from "@/types/product"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, X } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import { Collection } from "@/types/collection"
import { ProductStatus, ProductUnit } from "@/types/enums";

interface ProductFormModalProps {
  product?: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ProductFormData) => Promise<void>
  loading?: boolean
  allCollections: Collection[]
}

export function ProductFormModal({ product, open, onOpenChange, onSubmit, loading, allCollections }: ProductFormModalProps) {
  const { t } = useLanguage()
  const isEdit = !!product

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    unit: ProductUnit.other,
    description: "",
    price: 0,
    tierPrices: [],
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
  const [tierPriceError, setTierPriceError] = useState("")
  const lastTier = (formData.tierPrices || [])[(formData.tierPrices || []).length - 1]
  const cannotAddTierPrice = Boolean(lastTier && lastTier.maxQuantity === undefined)

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
      const nextMinQuantity = getNextTierMinQuantity(prev.tierPrices)

      if (nextMinQuantity === undefined) return prev

      return {
        ...prev,
        tierPrices: [
          ...(prev.tierPrices || []),
          {
            minQuantity: nextMinQuantity,
            price: prev.price || 0,
          },
        ],
      }
    })
  }

  const getNextTierMinQuantity = (tierPrices: ProductFormData["tierPrices"]) => {
    const tiers = tierPrices || []
    const lastTier = tiers[tiers.length - 1]

    if (!lastTier) return 1

    return lastTier.maxQuantity !== undefined ? lastTier.maxQuantity + 1 : undefined
  }

  const syncTierMinQuantities = (tierPrices: ProductFormData["tierPrices"]) => {
    return (tierPrices || []).map((tier, index, tiers) => {
      if (index === 0) return tier

      const previousTier = tiers[index - 1]

      return previousTier?.maxQuantity !== undefined
        ? { ...tier, minQuantity: previousTier.maxQuantity + 1 }
        : tier
    })
  }

  const updateTierPrice = (
    index: number,
    field: "minQuantity" | "maxQuantity" | "price",
    value: number | undefined,
  ) => {
    setFormData((prev) => ({
      ...prev,
      tierPrices: syncTierMinQuantities((prev.tierPrices || []).map((tier, tierIndex) => {
        if (tierIndex !== index) return tier

        return { ...tier, [field]: value }
      })),
    }))
  }

  const removeTierPrice = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tierPrices: syncTierMinQuantities((prev.tierPrices || []).filter((_, tierIndex) => tierIndex !== index)),
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
      setFormData({
        name: product.name,
        unit: product.unit,
        description: product.description,
        price: product.price || 0,
        tierPrices: product.tierPrices || [],
        cost: product.cost || 0,
        stock: product.stock || 0,
        minStock: product.minStock || 0,
        barcode: product.barcode,
        status: product.status,
        supplier: product.supplier,
        image: product.image,
        subImages: product.subImages || [],
        collections: product.collections || [],
      })
    } else {
      setFormData({
        name: "",
        unit: ProductUnit.other,
        description: "",
        price: 0,
        tierPrices: [],
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
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const invalidTier = (formData.tierPrices || []).find((tier) => (
      tier.maxQuantity !== undefined && tier.maxQuantity <= tier.minQuantity
    ))

    if (invalidTier) {
      setTierPriceError(t("products.form.tierPriceRangeError"))
      return
    }

    setTierPriceError("")
    await onSubmit(formData)
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
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">{t("products.form.cost")} *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData((prev) => ({ ...prev, cost: Number.parseFloat(e.target.value) || 0 }))}
                required
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
                  <div key={index} className="grid grid-cols-1 gap-3 rounded-lg border p-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                    <div className="space-y-2">
                      <Label>{t("products.form.minQuantity")}</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={tier.minQuantity}
                        onChange={(e) => updateTierPrice(index, "minQuantity", Number.parseInt(e.target.value) || 1)}
                        readOnly={index > 0}
                        className={index > 0 ? "bg-gray-100" : undefined}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("products.form.maxQuantity")}</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={tier.maxQuantity ?? ""}
                        onChange={(e) => updateTierPrice(index, "maxQuantity", e.target.value ? Number.parseInt(e.target.value) || 1 : undefined)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("products.form.tierPrice")}</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tier.price}
                        onChange={(e) => updateTierPrice(index, "price", Number.parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={() => removeTierPrice(index)}
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
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData((prev) => ({ ...prev, stock: Number.parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">{t("products.form.minStock")}</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData((prev) => ({ ...prev, minStock: Number.parseInt(e.target.value) || 0 }))}
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
