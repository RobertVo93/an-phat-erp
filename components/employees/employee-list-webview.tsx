import { Badge } from "@/components/ui/badge"
import { getEmployeeStatusColor, getEmployeeTypeColor } from "@/lib/utils"
import { Employee, EmployeeFilters } from "@/types/employee"
import { useLanguage } from "@/contexts/language-context"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import EmployeeActions from "@/components/employees/employee-actions"
import { CustomLink } from "@/components/common/custom-link"
import { ADMIN_ROUTES } from "@/constants/nav"
import type { EmployeeSortBy } from "@/types/employee"

interface EmployeeListBodyProps {
  filters: EmployeeFilters
  employees: Employee[]
  totalEmployees: number
  itemsPerPage: number
  currentPage: number
  totalPages: number
  loading: boolean

  handleSort: (field: EmployeeSortBy) => void
  setCurrentPage: (currentPage: number) => void
  setItemsPerPage: (pageSize: number) => void
  handleEditEmployee: (employee: Employee) => void
  handleDeleteEmployee: (employee: Employee) => void
}

export const EmployeeListWebview = ({
  filters,
  employees,
  totalEmployees,
  itemsPerPage,
  currentPage,
  totalPages,
  loading,
  handleSort,
  setCurrentPage,
  setItemsPerPage,
  handleEditEmployee,
  handleDeleteEmployee,
}: EmployeeListBodyProps) => {
  const { t } = useLanguage()
  type EmployeeTableRow = Employee & { id: string }
  const tableRows = employees.filter((employee): employee is EmployeeTableRow => Boolean(employee.id))

  // Define columns for ServersideTable
  const columns: ServersideTableColumn<EmployeeTableRow>[] = [
    {
      key: "name",
      title: t("employees.form.name"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <CustomLink href={ADMIN_ROUTES.employeeDetail(row.number || row.id || "")}>
            {row.name}
          </CustomLink>
          <p className="text-xs text-muted-foreground">{row.number}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("employees.form.status"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <Badge className={getEmployeeStatusColor(row.status!)} variant="secondary">
            {t(`employees.status.${row.status!}`)}
          </Badge>
        </div>
      ),
    },
    {
      key: "employeeType",
      title: t("employees.form.employeeType"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <Badge variant="outline" className={getEmployeeTypeColor(row.employeeType!)}>
            {t(`employees.type.${row.employeeType}`)}
          </Badge>
        </div>
      ),
    },
    {
      key: "position",
      title: t("employees.filter.position"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.position}</p>
          <p className="text-xs text-muted-foreground">{t(`employees.departments.${row.department?.toLowerCase()}`)}</p>
        </div>
      ),
    },
    {
      key: "email",
      title: t("employees.form.email"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      title: t("employees.form.phone"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.phone}</p>
        </div>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (row) => (
        <div className="space-y-1">
          <EmployeeActions
            employee={row}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
          />
        </div>
      ),
    },
  ]

  return (
    <ServersideTable
      columns={columns}
      data={tableRows}
      total={totalEmployees}
      currentPage={currentPage}
      pageSize={itemsPerPage}
      sortBy={filters.sortBy!}
      sortOrder={filters.sortOrder!}
      loading={loading}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onSort={(field) => handleSort(field as EmployeeSortBy)}
      showPageSize
      onPageSizeChange={setItemsPerPage}
    />
  )
}
