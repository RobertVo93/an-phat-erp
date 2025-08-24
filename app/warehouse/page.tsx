"use client"

import { ERPLayout } from "@/components/erp-layout"
import { useWarehouses } from "@/hooks/use-warehouses"
import { WarehouseFormModal } from "@/components/warehouses/warehouse-form-modal"
import { WarehouseViewModal } from "@/components/warehouses/warehouse-view-modal"
import { WarehouseDeleteModal } from "@/components/warehouses/warehouse-delete-modal"
import { WarehouseHeader } from "@/components/warehouses/WarehouseHeader"
import { WarehouseList } from "@/components/warehouses/WarehouseList"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"

export default function WarehousePage() {
  const {
    warehouses,
    loading,
    isFormModalOpen,
    isViewModalOpen,
    isDeleteModalOpen,
    selectedWarehouse,
    formMode,
    addWarehouse,
    updateWarehouse,
    handleCreateWarehouse,
    handleViewWarehouse,
    handleEditWarehouse,
    handleDeleteWarehouse,
    setIsFormModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    confirmDelete,
  } = useWarehouses()

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <WarehouseHeader onCreateWarehouse={handleCreateWarehouse} />
        <WarehouseList
          warehouses={warehouses}
          onView={handleViewWarehouse}
          onEdit={handleEditWarehouse}
          onDelete={handleDeleteWarehouse}
        />

        {/* Modals */}
        <WarehouseFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={addWarehouse}
          onUpdate={updateWarehouse}
          warehouse={selectedWarehouse!}
          mode={formMode}
        />

        <WarehouseViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          warehouse={selectedWarehouse}
        />

        <WarehouseDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          warehouse={selectedWarehouse}
        />
      </div>
    </ERPLayout>
  )
}
