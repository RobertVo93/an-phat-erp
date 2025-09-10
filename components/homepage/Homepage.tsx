"use client"

import { useHomepage } from "@/hooks/use-homepage"
import { HeaderCards } from "@/components/homepage/HeaderCards"
import { RecentOrders } from "@/components/homepage/RecentOrders"
import { QuickActions } from "@/components/homepage/QuickActions"
import { OrderNewModal } from "@/components/orders/modals/OrderNewModal"
import { CustomerFormModal } from "@/components/customers/customer-form-modal"
import { ProductFormModal } from "@/components/products/product-form-modal"
import { ProductionNewModal } from "@/components/production/ProductionNewModal"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"

export function Homepage() {
  const {
    // header
    stats,
    // recent
    recentOrders,
    totalRecentOrders,
    totalRecentPages,
    recentPage,
    pageSize,
    loadingRecent,
    fetchRecentOrders,
    // quick action states
    showOrderModal,
    showCustomerModal,
    showProductModal,
    showProductionModal,
    setShowOrderModal,
    setShowCustomerModal,
    setShowProductModal,
    setShowProductionModal,
    // refs
    allWarehouses,
    availableProducts,
    allCollections,
    allUtilities,
    allEmployees,
    isLoading,
    creatingProduct,
    creatingProduction,
    loadingStats,
    handleCreateProduct,
    handleCreateOrder,
    handleCreateProduction,
    handleCreateCustomer,
  } = useHomepage()

  return (
    <div className="space-y-6">
      <LoadingOverlay loading={isLoading} />
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome to AN PHAT</h2>
        <p className="text-muted-foreground">Here's what's happening with your business today.</p>
      </div>

      <HeaderCards stats={stats} loading={loadingStats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders
          data={recentOrders}
          total={totalRecentOrders}
          currentPage={recentPage}
          pageSize={pageSize}
          sortBy="deliveryDate"
          sortOrder="desc"
          totalPages={totalRecentPages}
          loading={loadingRecent}
          onPageChange={fetchRecentOrders}
          onSort={() => {}}
        />
        <QuickActions
          onCreateOrder={() => setShowOrderModal(true)}
          onCreateCustomer={() => setShowCustomerModal(true)}
          onCreateProduct={() => setShowProductModal(true)}
          onCreateProduction={() => setShowProductionModal(true)}
        />
      </div>

      {/* Modals */}
      <OrderNewModal
        open={showOrderModal}
        allWarehouses={allWarehouses}
        onOpenChange={setShowOrderModal}
        createOrder={handleCreateOrder}
      />
      <CustomerFormModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSave={handleCreateCustomer}
        mode="create"
      />
      <ProductFormModal
        open={showProductModal}
        onOpenChange={setShowProductModal}
        onSubmit={handleCreateProduct}
        loading={creatingProduct}
        allCollections={allCollections}
      />
      <ProductionNewModal
        isNewProductionOpen={showProductionModal}
        closeNewProduction={() => setShowProductionModal(false)}
        createNewProduction={handleCreateProduction}
        availableMaterials={availableProducts}
        availableProducts={availableProducts}
        availableUtilities={allUtilities}
        availableEmployees={allEmployees}
        availableWarehouses={allWarehouses}
        isLoading={creatingProduction}
      />
    </div>
  )
}


