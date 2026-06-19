import { ERPLayout } from "@/components/erp-layout"
import { CustomersPageClient } from "@/components/customers/customers-page-client"
import { getCustomerPageData } from "@/lib/services/customerPageService"

export const dynamic = "force-dynamic"

export default async function CustomersPage() {
  const initialData = await getCustomerPageData()

  return (
    <ERPLayout>
      <CustomersPageClient initialData={initialData} />
    </ERPLayout>
  )
}
