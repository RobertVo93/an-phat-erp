import React from "react"
import { useLanguage } from "@/contexts/language-context"
import { WarehouseProduct } from "@/types"
import { Button } from "@/components/ui/button"
import { ClientsideTable, ClientsideTableColumn } from "@/components/common/table/ClientsideTable"

interface Props {
  warehouseProducts: WarehouseProduct[]
  onOpenTransferModal: (WarehouseProduct: WarehouseProduct) => void
}

export const ProductWarehousesTable = ({ warehouseProducts, onOpenTransferModal }: Props) => {
  const { t } = useLanguage()

  const columns: ClientsideTableColumn<WarehouseProduct>[] = [
    {
      key: "warehouseName",
      title: t("products.table.warehouseName"),
      sortable: true,
      render: (record) => record.warehouse?.name ?? "-",
    },
    {
      key: "quantity",
      title: t("products.table.quantity"),
      sortable: true,
      render: (record) => {
        const quantity = record.quantity ?? 0
        const unit = record.product?.unit ?? ""
        return `${quantity} ${t(`products.table.${unit}`)}`
      },
    },
    {
      key: "actions",
      title: t("products.table.actions"),
      sortable: false,
      render: (record) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenTransferModal(record)}
            >
              {t("products.table.transferProduct")}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-2 py-4">
      <ClientsideTable
        columns={columns}
        data={warehouseProducts}
        pageSize={10}
        initialSortBy="date"
        initialSortOrder="desc"
      />
    </div>
  )
}