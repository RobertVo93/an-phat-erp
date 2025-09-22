import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEmployeeStatusColor, getEmployeeTypeColor } from "@/lib/utils"
import { Employee } from "@/types/employee"
import { Building, ChevronLeft, ChevronRight, Mail, Phone, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import EmployeeActions from "@/components/employees/employee-actions"
import { useLanguage } from "@/contexts/language-context"

interface EmployeeListBodyProps {
    employees: Employee[]
    currentPage: number
    totalPages: number
    setCurrentPage: (currentPage: number) => void
    handleViewEmployee: (employee: Employee) => void
    handleEditEmployee: (employee: Employee) => void
    handleDeleteEmployee: (employee: Employee) => void
}
export const EmployeeListBody = ({
    employees,
    currentPage,
    totalPages,
    setCurrentPage,
    handleViewEmployee,
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
                                    <h3 className="font-semibold text-base truncate">{employee.name}</h3>
                                    <Badge className={getEmployeeStatusColor(employee.status!)} variant="secondary">
                                        {t(`employees.status.${employee.status}`)}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                            {employee.position} - {t(`employees.departments.${employee.department}`)}
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
                                handleViewEmployee={handleViewEmployee}
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

            {/* Pagination - Mobile Optimized */}
            <Card className="p-4 mt-2">
                <div className="flex items-center justify-center space-x-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            let pageNumber: number
                            if (totalPages <= 3) {
                                pageNumber = i + 1
                            } else if (currentPage <= 2) {
                                pageNumber = i + 1
                            } else if (currentPage >= totalPages - 1) {
                                pageNumber = totalPages - 2 + i
                            } else {
                                pageNumber = currentPage - 1 + i
                            }

                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className="w-8 h-8 p-0"
                                >
                                    {pageNumber}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </Card>
        </>
    )
}