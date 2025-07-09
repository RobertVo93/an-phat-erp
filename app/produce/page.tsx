"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, History, BarChart3, Loader2 } from "lucide-react"
import { ERPLayout } from "@/components/erp-layout"
import { EditProductionModal } from "@/components/modals/edit-production-modal"
import { ProductionSummaryCards } from "@/components/production/production-summary-cards"
import { ProductionRecords } from "@/components/production/production-records"
import { ProductionDetailModal } from "@/components/production/production-detail-modal"
import { ProductionHistory } from "@/components/production/production-history"
import { NewProductionForm } from "@/components/production/new-production-form"
import { useProduction } from "@/hooks/use-production"
import { useLanguage } from "@/contexts/language-context"

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
    historyRecords,
    availableUtilities,
    availableEmployees,
    materialCost, 
    utilityCost, 
    employeeCost,

    handleViewRecord,
    handleEditRecord,
    handleSaveEdit,
    closeDetailModal,
    closeEditModal,
    openNewProduction,
    closeNewProduction,
    createNewProduction
  } = useProduction()
  const { t } = useLanguage()

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("production.management")}</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">

            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button className="w-full sm:w-auto" onClick={openNewProduction}>
              <Plus className="mr-2 h-4 w-4" />
              {t("production.newProduction")}
            </Button>
          </div>
        </div>

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

          {/* Tab Content - Hôm Nay */}
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

          {/* Tab Content - Lịch Sử */}
          <TabsContent value="history" className="space-y-4 sm:space-y-6">
            <ProductionHistory
              historyRecords={historyRecords}
              onViewRecord={handleViewRecord}
              onEditRecord={handleEditRecord}
            />
          </TabsContent>
        </Tabs>

        {/* New Production Modal */}
        <Dialog open={isNewProductionOpen} onOpenChange={closeNewProduction}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("production.createNewProduction")}</DialogTitle>
              <DialogDescription>
                {t("production.createNewProductionDescription")}
              </DialogDescription>
            </DialogHeader>
            <NewProductionForm
              availableMaterials={availableMaterials}
              availableProducts={availableProducts}
              availableUtilities={availableUtilities}
              availableEmployees={availableEmployees}
              onClose={closeNewProduction}
              createNewProduction={createNewProduction}
            />
          </DialogContent>
        </Dialog>

        {/* Production Detail Modal */}
        <ProductionDetailModal record={selectedRecord} isOpen={!!selectedRecord} onClose={closeDetailModal} />

        {/* Edit Production Modal */}
        {editingRecord && (
          <EditProductionModal
            availableMaterials={availableMaterials}
            availableProducts={availableProducts}
            availableUtilities={availableUtilities}
            availableEmployees={availableEmployees}
            isOpen={isEditModalOpen}
            onClose={closeEditModal}
            record={editingRecord}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    </ERPLayout>
  )
}
