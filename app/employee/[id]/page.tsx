import { EmployeeDetailClient } from "@/components/employees/detail"
import { ERPLayout } from "@/components/erp-layout"
import { getEmployeeDetailPageData } from "@/lib/services/employeeDetailPageService"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface IEmployeeDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({ params }: IEmployeeDetailPageProps) {
  const { id } = await params
  const { employee } = await getEmployeeDetailPageData(id)

  if (!employee) notFound()

  return (
    <ERPLayout>
      <EmployeeDetailClient employee={employee} />
    </ERPLayout>
  )
}
