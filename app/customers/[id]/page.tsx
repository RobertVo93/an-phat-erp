import { ERPLayout } from "@/components/erp-layout"
import { CustomerDetailClient } from "@/components/customers/customer-detail-client"
import { getCustomerDetailPageData } from "@/lib/services/customerDetailPageService"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface ICustomerDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CustomerDetailPage({ params }: ICustomerDetailPageProps) {
  const { id } = await params
  const data = await getCustomerDetailPageData(id)

  if (!data.customer) notFound()

  return (
    <ERPLayout>
      <CustomerDetailClient id={id} initialData={data} />
    </ERPLayout>
  )
}
