import { ERPLayout } from "@/components/erp-layout"
import { OrdersPageClient } from "@/components/orders/orders-page-client"
import { getOrderPageData, type OrderPageSearchParams } from "@/lib/services/orderPageService"

export const dynamic = "force-dynamic"

interface IOrdersPageProps {
  searchParams: Promise<OrderPageSearchParams>
}

export default async function OrdersPage({ searchParams }: IOrdersPageProps) {
  const resolvedSearchParams = await searchParams
  const initialData = await getOrderPageData(resolvedSearchParams)

  return (
    <ERPLayout>
      <OrdersPageClient
        key={JSON.stringify(resolvedSearchParams)}
        initialData={initialData}
      />
    </ERPLayout>
  )
}
