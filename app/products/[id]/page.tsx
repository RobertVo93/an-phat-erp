"use client"

import { ERPLayout } from "@/components/erp-layout"
import { useLanguage } from "@/contexts/language-context"
import { useProduct } from "@/hooks/use-product"
import { useParams } from "next/navigation"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ProductDetailHeader } from "@/components/products/product-detail-header"
import ProductDetailInformation from "@/components/products/product-detail-information"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ProductWarehousesTable } from "@/components/products/product-warehouses-table"
import { ProductTransferModal } from "@/components/products/product-transfer-modal"


export default function ProductsPage() {
  const params = useParams()
  const { t } = useLanguage()
  const {
    loading,
    product,
    isOpen,
    sourceWH,
    availableQuantity,
    warehouses,
    onOpen,
    onClose,
    onSubmit,
  } = useProduct(params.id as string)

  if (!product) return null;

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />

      <div className="space-y-6">
        <ProductDetailHeader />

        <ProductDetailInformation t={t} product={product} />

        <Card className="p-6 space-y-6">
          <CardTitle>
            {t("products.detail.listWarehouse")}:
          </CardTitle>
          <CardContent className="p-0">
            <ProductWarehousesTable
              warehouseProducts={product.warehouseProducts!}
              onOpenTransferModal={onOpen}
            />
          </CardContent>
        </Card>

        <ProductTransferModal
          product={product}
          isOpen={isOpen}
          sourceWH={sourceWH}
          availableQuantity={availableQuantity}
          warehouses={warehouses}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </ERPLayout>
  )
}
