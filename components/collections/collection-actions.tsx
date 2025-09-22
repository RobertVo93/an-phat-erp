"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collection } from "@/types";

interface Props {
  collection: Collection
  handleView: (collection: Collection) => void
  handleEdit: (collection: Collection) => void
  handleDelete: (collection: Collection) => void
}

export default function CollectionActions({
  collection,
  handleView, handleEdit, handleDelete
}: Props) {
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleView(collection)}>
          <Eye className="mr-2 h-4 w-4" />
          {t("common.view")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEdit(collection)}>
          <Edit className="mr-2 h-4 w-4" />
          {t("common.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(collection)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          {t("common.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}