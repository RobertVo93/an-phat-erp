import { ERPLayout } from "@/components/erp-layout"
import { ProductionDetailClient } from "@/components/production/detail"
import { getProductionDetailPageData } from "@/lib/services/productionDetailPageService"

export const dynamic = "force-dynamic"

interface IProductionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductionDetailPage({ params }: IProductionDetailPageProps) {
  const { id } = await params
  const data = await getProductionDetailPageData(id)

  return (
    <ERPLayout>
      <ProductionDetailClient
        record={data.record}
        availableProducts={data.availableProducts}
        availableMaterials={data.availableMaterials}
        availableUtilities={data.availableUtilities}
        availableEmployees={data.availableEmployees}
        availableWarehouses={data.availableWarehouses}
      />
    </ERPLayout>
  )
}
