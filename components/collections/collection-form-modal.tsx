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
    category: "",
    status: "Draft",
    totalValue: "$0.00",
    productCount: 0,
    createdDate: new Date().toISOString().split("T")[0],
    image: "", // Add image field
  })

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description,
        category: collection.category,
        status: collection.status,
        totalValue: collection.totalValue,
        productCount: collection.productCount,
        createdDate: collection.createdDate,
        image: collection.image || "", // Add image field
      })
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        status: "Draft",
        totalValue: "$0.00",
        productCount: 0,
        createdDate: new Date().toISOString().split("T")[0],
        image: "", // Add image field
      })
    }
  }, [collection, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const collectionData = {
      ...formData,
      category: formData.category as "Fashion" | "Electronics" | "Home" | "Office",
      status: formData.status as "Active" | "Draft" | "Archived",
    }

    if (collection) {
      onSave({ ...collection, ...collectionData })
    } else {
      onSave(collectionData)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{collection ? "Chỉnh Sửa Bộ Sưu Tập" : "Tạo Bộ Sưu Tập Mới"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên Bộ Sưu Tập *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên bộ sưu tập"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Danh Mục *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fashion">Thời Trang</SelectItem>
                  <SelectItem value="Electronics">Điện Tử</SelectItem>
                  <SelectItem value="Home">Gia Dụng</SelectItem>
                  <SelectItem value="Office">Văn Phòng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô Tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả bộ sưu tập"
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
            label="Ảnh Bộ Sưu Tập"
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Hoạt Động</SelectItem>
                  <SelectItem value="Draft">Bản Nháp</SelectItem>
                  <SelectItem value="Archived">Đã Lưu Trữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productCount">Số Sản Phẩm</Label>
              <Input
                id="productCount"
                type="number"
                value={formData.productCount}
                onChange={(e) => setFormData({ ...formData, productCount: Number.parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalValue">Tổng Giá Trị</Label>
              <Input
                id="totalValue"
                value={formData.totalValue}
                onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                placeholder="$0.00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{collection ? "Cập Nhật" : "Tạo Mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
