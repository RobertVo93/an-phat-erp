"use client"

import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ERPLayout } from "@/components/erp-layout"
import { useWarehouse } from "@/hooks/use-warehouse"
import { useParams } from "next/navigation"
import { WarehouseDetailHeader } from "@/components/warehouses/WarehouseDetailHeader"
import { WarehouseDetail } from "@/components/warehouses/WarehouseDetail"
import { WarehouseTransferModal } from "@/components/warehouses/warehouse-transfer-modal"

export default function WarehouseDetailPage() {
  const params = useParams()
  const {
    loading,
    warehouse,
    warehouses,
    isTransferModalOpen,
    selectedProduct,

    onOpenTransferModal,
    onCloseTransferModal,
    onSubmitTransfer,
  } = useWarehouse(params.id as string)

  if (!warehouse) return null

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />

      <div className="space-y-6">
        <WarehouseDetailHeader />

        <WarehouseDetail
          warehouse={warehouse}
          onOpenTransferModal={onOpenTransferModal}
        />

        <WarehouseTransferModal
          isOpen={isTransferModalOpen}
          sourceWH={warehouse}
          warehouses={warehouses}
          product={selectedProduct!}
          onClose={onCloseTransferModal}
          onSubmit={onSubmitTransfer}
        />
      </div>
    </ERPLayout>
  )
}