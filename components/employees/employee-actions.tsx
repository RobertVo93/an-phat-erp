import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { Employee } from "@/types"
import { useRouter } from "next/navigation"
import { ADMIN_ROUTES } from "@/constants/nav"

interface Props {
  employee: Employee
  handleEditEmployee: (employee: Employee) => void
  handleDeleteEmployee: (employee: Employee) => void
}

export default function EmployeeActions({
  employee,
  handleEditEmployee, 
  handleDeleteEmployee
}: Props) {
  const { t } = useLanguage()
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(ADMIN_ROUTES.employeeDetail(employee.number || employee.id || ""))}>
          <Eye className="mr-2 h-4 w-4" />
          {t("employees.view")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
          <Edit className="mr-2 h-4 w-4" />
          {t("employees.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeleteEmployee(employee)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          {t("employees.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
