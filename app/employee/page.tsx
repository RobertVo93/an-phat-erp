import { EmployeePageClient } from "@/components/employees/employee-page-client"
import { ERPLayout } from "@/components/erp-layout"
import {
  getEmployeePageData,
  type EmployeePageSearchParams,
} from "@/lib/services/employeePageService"

export const dynamic = "force-dynamic"

interface IEmployeePageProps {
  searchParams: Promise<EmployeePageSearchParams>
}

export default async function EmployeePage({ searchParams }: IEmployeePageProps) {
  const resolvedSearchParams = await searchParams
  const initialData = await getEmployeePageData(resolvedSearchParams)

  return (
    <ERPLayout>
      <EmployeePageClient
        key={JSON.stringify(resolvedSearchParams)}
        initialData={initialData}
      />
    </ERPLayout>
  )
}
