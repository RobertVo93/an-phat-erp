import { ERPLayout } from "@/components/erp-layout"
import { OrderDetailClient } from "@/components/orders/order-detail-client"
import { getOrderDetailPageData } from "@/lib/services/orderDetailPageService"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface IOrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: IOrderDetailPageProps) {
  const { id } = await params
  const data = await getOrderDetailPageData(id)

  if (!data.order) notFound()

  return (
    <ERPLayout>
      <OrderDetailClient orderId={id} initialData={data} />
    </ERPLayout>
  )
}
