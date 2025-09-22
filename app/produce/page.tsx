"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, BarChart3 } from "lucide-react"
import { ERPLayout } from "@/components/erp-layout"
import { ProductionSummaryCards } from "@/components/production/production-summary-cards"
import { ProductionRecords } from "@/components/production/production-records"
import { ProductionDetailModal } from "@/components/production/production-detail-modal"
import { ProductionHistory } from "@/components/production/production-history"
import { useProduction } from "@/hooks/use-production"
import { useLanguage } from "@/contexts/language-context"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ProductionListHeader } from "@/components/production/ProductionListHeader"
import { ProductionNewModal } from "@/components/production/ProductionNewModal"
import { ProductionEditModal } from "@/components/production/ProductionEditModal"

export default function ProducePage() {
  const [activeTab, setActiveTab] = useState("today")
  const {
    selectedRecord,
    isEditModalOpen,
    editingRecord,
    isNewProductionOpen,
    loading,
    availableProducts,
    availableMaterials,
    todayRecords,
    availableUtilities,
    availableEmployees,
    materialCost, 
    utilityCost, 
    employeeCost,
    availableWarehouses,

    handleViewRecord,
    handleEditRecord,
    handleSaveEdit,
    closeDetailModal,
    closeEditModal,
    openNewProduction,
    closeNewProduction,
    createNewProduction,
  } = useProduction()
  const { t } = useLanguage()

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <ProductionListHeader openNewProduction={openNewProduction} />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">{t("production.today")}</span>
              <span className="sm:hidden">{t("production.today")}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">{t("production.history")}</span>
              <span className="sm:hidden">{t("production.history")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content - Today */}
          <TabsContent value="today" className="space-y-4 sm:space-y-6">
            {/* Summary Cards */}
            <ProductionSummaryCards
              materialCost={materialCost}
              utilityCost={utilityCost}
              employeeCost={employeeCost}
            />

            {/* Production Records */}
            <ProductionRecords
              records={todayRecords}
              onViewRecord={handleViewRecord}
              onEditRecord={handleEditRecord}
            />
          </TabsContent>

          {/* Tab Content - History */}
          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <ProductionHistory
              onViewRecord={handleViewRecord}
              onEditRecord={handleEditRecord}
            />
          </TabsContent>
        </Tabs>

        {/* New Production Modal */}
        <ProductionNewModal
          isNewProductionOpen={isNewProductionOpen}
          closeNewProduction={closeNewProduction}
          createNewProduction={createNewProduction}
          availableMaterials={availableMaterials}
          availableProducts={availableProducts}
          availableUtilities={availableUtilities}
          availableEmployees={availableEmployees}
          availableWarehouses={availableWarehouses}
          isLoading={loading}
        />

        {/* Production Detail Modal */}
        <ProductionDetailModal record={selectedRecord} isOpen={!!selectedRecord} onClose={closeDetailModal} />

        {/* Edit Production Modal */}
        <ProductionEditModal
          availableMaterials={availableMaterials}
          availableProducts={availableProducts}
          availableUtilities={availableUtilities}
          availableEmployees={availableEmployees}
          availableWarehouses={availableWarehouses}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          record={editingRecord}
          onSave={handleSaveEdit}
          isLoading={loading}
        />
      </div>
    </ERPLayout>
  )
}
