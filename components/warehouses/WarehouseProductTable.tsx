import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { Product, Warehouse, WarehouseProduct } from "@/types"
import { Button } from "@/components/ui/button"
import { ClientsideTable, ClientsideTableColumn } from "@/components/common/table/ClientsideTable"

interface Props {
  warehouse: Warehouse
  onOpenTransferModal: (product: Product) => void
}

export const WarehouseProductTable = ({ warehouse, onOpenTransferModal }: Props) => {
  const { t } = useLanguage()

  const whProductColumns: ClientsideTableColumn<WarehouseProduct>[] = [
    {
      key: "productName",
      title: t("warehouse.table.productName"),
      sortable: true,
      render: (record) => record.product?.name ?? "-",
    },
    {
      key: "quantity",
      title: t("warehouse.table.quantity"),
      sortable: true,
      render: (record) => {
        const quantity = record.quantity ?? 0
        const unit = record.product?.unit ?? ""
        return `${quantity} ${t(`warehouse.table.${unit}`)}`
      },
    },
    {
      key: "actions",
      title: t("warehouse.table.actions"),
      sortable: false,
      render: (record) => {
        const warehouseProduct = record.product
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenTransferModal(warehouseProduct!)}
            >
              {t("warehouse.table.transferProduct")}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-2 border-t py-4">
      <h4 className="font-medium text-base">{t("warehouse.products")}</h4>
      <ClientsideTable
        columns={whProductColumns}
        data={warehouse.warehouseProducts!}
        pageSize={10}
        initialSortBy="date"
        initialSortOrder="desc"
      />
    </div>
  )
}