"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, BarChart3 } from "lucide-react"
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
import type { IProductionPageData } from "@/types/production-page"

interface IProducePageClientProps {
  initialData: IProductionPageData
}

export function ProducePageClient({ initialData }: IProducePageClientProps) {
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
  } = useProduction(initialData)
  const { t } = useLanguage()

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className="space-y-4 sm:space-y-6">
        <ProductionListHeader openNewProduction={openNewProduction} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>{t("production.today")}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span>{t("production.history")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 sm:space-y-6">
            <ProductionSummaryCards
              materialCost={materialCost}
              utilityCost={utilityCost}
              employeeCost={employeeCost}
            />

            <ProductionRecords
              records={todayRecords}
              onViewRecord={handleViewRecord}
              onEditRecord={handleEditRecord}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <ProductionHistory
              products={availableProducts}
              onViewRecord={handleViewRecord}
              onEditRecord={handleEditRecord}
            />
          </TabsContent>
        </Tabs>

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

        <ProductionDetailModal record={selectedRecord} isOpen={!!selectedRecord} onClose={closeDetailModal} />

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
    </>
  )
}
