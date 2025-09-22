import { Badge } from "@/components/ui/badge"
import { Customer, CustomerFilters } from "@/types"
import { getCustomerStatusColor, getCustomerTypeColor } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import CustomerActions from "@/components/customers/customer-actions"

interface Props {
  customers: Customer[]
  totalCustomers: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
  filters: CustomerFilters
  loading: boolean
  setCurrentPage: (page: number) => void
  translateStatus: (status: string) => string
  translateCustomerType: (type: string) => string
  handleViewCustomer: (customer: Customer) => void
  handleEditCustomer: (customer: Customer) => void
  handleDeleteCustomer: (customer: Customer) => void
  handleSort: (field: string) => void
}

export default function CustomerListWebview({
  customers,
  totalCustomers,
  itemsPerPage,
  totalPages,
  currentPage,
  filters,
  loading,
  setCurrentPage,
  translateStatus,
  translateCustomerType,
  handleViewCustomer,
  handleEditCustomer,
  handleDeleteCustomer,
  handleSort
}: Props) {
  const { t } = useLanguage()
  const columns: ServersideTableColumn<any>[] = [
    {
      key: "name",
      title: t("customers.title"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.number}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("customers.form.status"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <Badge className={`text-xs ${getCustomerStatusColor(row.status!)}`}>
            {translateStatus(row.status!)}
          </Badge>
        </div>
      ),
    },
    {
      key: "customerType",
      title: t("customers.filter.customerType"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <Badge
            variant="outline"
            className={`text-xs ${getCustomerTypeColor(row.customerType!)}`}
          >
            {translateCustomerType(row.customerType!)}
          </Badge>
        </div>
      ),
    },
    {
      key: "phone",
      title: t("customers.form.contactInfo"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.phone}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "location",
      title: t("customers.filter.location"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.location}</p>
        </div>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <CustomerActions
            customer={row}
            handleViewCustomer={handleViewCustomer}
            handleEditCustomer={handleEditCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
          />
        </div>
      ),
    },
  ]

  return (
    <ServersideTable
      columns={columns}
      data={customers}
      total={totalCustomers}
      currentPage={currentPage}
      pageSize={itemsPerPage}
      sortBy={filters.sortBy || "number"}
      sortOrder={filters.sortOrder || "asc"}
      onPageChange={setCurrentPage}
      onSort={handleSort}
      loading={loading}
      totalPages={totalPages}
    />
  )
}