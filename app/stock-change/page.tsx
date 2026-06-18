import { ERPLayout } from "@/components/erp-layout"
import { StockChangePageClient } from "@/components/stock-change/stock-change-page-client"
import { getStockChangePageData } from "@/lib/services/stockChangePageService"

export const dynamic = "force-dynamic"

export default async function StockChangePage() {
  const initialData = await getStockChangePageData()

  return (
    <ERPLayout>
      <StockChangePageClient initialData={initialData} />
    </ERPLayout>
  )
}
