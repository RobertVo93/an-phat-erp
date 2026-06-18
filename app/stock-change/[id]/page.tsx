import { ERPLayout } from "@/components/erp-layout"
import { StockChangeDetailClient } from "@/components/stock-change/detail"
import { env } from "@/constants/env"
import { getStockChangeDetailPageData } from "@/lib/services/stockChangeDetailPageService"

export const dynamic = "force-dynamic"

interface IStockChangeDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function StockChangeDetailPage({ params }: IStockChangeDetailPageProps) {
  const { id } = await params
  const data = await getStockChangeDetailPageData(id)

  return (
    <ERPLayout>
      <StockChangeDetailClient
        record={data.record}
        products={data.products}
        warehouses={data.warehouses}
        taxRate={env.NEXT_PUBLIC_TAX_RATE}
      />
    </ERPLayout>
  )
}
