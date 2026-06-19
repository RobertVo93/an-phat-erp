import { ERPLayout } from "@/components/erp-layout"
import { ProducePageClient } from "@/components/production/produce-page-client"
import { getProductionPageData } from "@/lib/services/productionPageService"

export const dynamic = "force-dynamic"

export default async function ProducePage() {
  const initialData = await getProductionPageData()

  return (
    <ERPLayout>
      <ProducePageClient initialData={initialData} />
    </ERPLayout>
  )
}
