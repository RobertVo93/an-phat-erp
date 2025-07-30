"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import type { Collection } from "@/types/collection"
import { ImageUpload } from "@/components/ui/image-upload"
import { CollectionStatus } from "@/types/enums"

interface CollectionFormModalProps {
  collection?: Collection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (collection: Omit<Collection, "id"> | Collection) => void
}

export function CollectionFormModal({ collection, open, onOpenChange, onSave }: CollectionFormModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: CollectionStatus.draft,
    createdAt: new Date().toISOString().split("T")[0],
    image: "",
  })

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || "",
        description: collection.description || "",
        status: collection.status || CollectionStatus.draft,
        createdAt: collection.createdAt as any || new Date().toISOString().split("T")[0],
        image: collection.image || "", // Add image field
      })
    } else {
      setFormData({
        name: "",
        description: "",
        status: CollectionStatus.draft,
        createdAt: new Date().toISOString().split("T")[0],
        image: "",
      })
    }
  }, [collection, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const collectionData = {
      ...formData,
    }

    if (collection) {
      onSave({ ...collection, ...collectionData as any })
    } else {
      onSave(collectionData as any)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{collection ? t("collections.form.edit") : t("collections.form.create")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("collections.form.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("collections.form.namePlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t("collections.form.status")}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as CollectionStatus })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CollectionStatus.active}>{t("collections.status.active")}</SelectItem>
                  <SelectItem value={CollectionStatus.draft}>{t("collections.status.draft")}</SelectItem>
                  <SelectItem value={CollectionStatus.archived}>{t("collections.status.archived")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("collections.form.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("collections.form.descriptionPlaceholder")}
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
            label={t("collections.form.image")}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit">{collection ? t("common.update") : t("common.create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
