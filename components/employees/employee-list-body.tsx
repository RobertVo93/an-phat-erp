import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEmployeeStatusColor, getEmployeeTypeColor } from "@/lib/utils"
import { Employee } from "@/types/employee"
import { Building, Mail, Phone, Users } from "lucide-react"
import EmployeeActions from "@/components/employees/employee-actions"
import { useLanguage } from "@/contexts/language-context"
import { CustomLink } from "@/components/common/custom-link"
import { ADMIN_ROUTES } from "@/constants/nav"
import { ServersidePagination } from "@/components/common/table/ServersidePagination"

interface EmployeeListBodyProps {
    employees: Employee[]
    currentPage: number
    totalPages: number
    pageSize: number
    totalEmployees: number
    setCurrentPage: (currentPage: number) => void
    handleEditEmployee: (employee: Employee) => void
    handleDeleteEmployee: (employee: Employee) => void
}
export const EmployeeListBody = ({
    employees,
    currentPage,
    totalPages,
    pageSize,
    totalEmployees,
    setCurrentPage,
    handleEditEmployee,
    handleDeleteEmployee,
}: EmployeeListBodyProps) => {
    const { t } = useLanguage()

    return (
        <>
            <div className="space-y-3">
                {employees.map((employee) => (
                    <Card key={employee.id} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CustomLink href={ADMIN_ROUTES.employeeDetail(employee.number || employee.id || "")}>
                                        {employee.name}
                                    </CustomLink>
                                    <Badge className={getEmployeeStatusColor(employee.status!)} variant="secondary">
                                        {t(`employees.status.${employee.status}`)}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                            {employee.position} - {t(`employees.departments.${employee.department?.toLowerCase()}`)}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{employee.email}</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-3 w-3 flex-shrink-0" />
                                        <span>{employee.phone}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex space-x-2">
                                        <Badge variant="outline" className={getEmployeeTypeColor(employee.employeeType!)}>
                                            {t(`employees.type.${employee.employeeType}`)}
                                        </Badge>
                                    </div>
                                    <span className="text-sm font-medium">{employee.salary}</span>
                                </div>
                            </div>

                            {/* Actions Dropdown */}
                            <EmployeeActions
                                employee={employee}
                                handleEditEmployee={handleEditEmployee}
                                handleDeleteEmployee={handleDeleteEmployee}
                            />
                        </div>
                    </Card>
                ))}

                {employees.length === 0 && (
                    <Card className="p-8">
                        <div className="text-center text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>{t("employees.noEmployeesFound")}</p>
                        </div>
                    </Card>
                )}
            </div>

            <div className="mt-4">
                <ServersidePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    total={totalEmployees}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    )
}
