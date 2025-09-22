import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Customer } from "@/types"

interface Props {
  customer: Customer
  handleViewCustomer: (customer: Customer) => void
  handleEditCustomer: (customer: Customer) => void
  handleDeleteCustomer: (customer: Customer) => void
}

export default function CustomerActions({
  customer,
  handleViewCustomer, handleEditCustomer, handleDeleteCustomer
}:Props) {
  const { t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
          <Eye className="mr-2 h-4 w-4" />
          {t("customers.viewCustomer")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
          <Edit className="mr-2 h-4 w-4" />
          {t("customers.editCustomer")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeleteCustomer(customer)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          {t("customers.deleteCustomer")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}