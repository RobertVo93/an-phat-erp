"use client"

import { Product } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Props {
  product: Product
  handleView: (product: Product) => void
  handleEdit: (product: Product) => void
  handleDelete: (product: Product) => void
}

export default function ProductActions({
  product,
  handleView,
  handleEdit,
  handleDelete,
}: Props) {
  const { t } = useLanguage() 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleView(product)
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("common.view")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleEdit(product)
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          {t("common.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(product)
          }}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("common.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}