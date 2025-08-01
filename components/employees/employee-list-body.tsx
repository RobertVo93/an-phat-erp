import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEmployeeStatusColor, getEmployeeTypeColor } from "@/lib/utils"
import { Employee } from "@/types/employee"
import { Building, ChevronLeft, ChevronRight, Mail, Phone, Users, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmployeeListBodyProps {
    t: (key: string) => string
    employees: Employee[]
    startIndex: number
    endIndex: number
    totalEmployees: number
    itemsPerPage: number
    currentPage: number
    totalPages: number
    setItemsPerPage: (itemsPerPage: number) => void
    setCurrentPage: (currentPage: number) => void
    handleViewEmployee: (employee: Employee) => void
    handleEditEmployee: (employee: Employee) => void
    handleDeleteEmployee: (employee: Employee) => void
    translateStatus: (status: string) => string
    translateDepartment: (department: string) => string
    translateEmployeeType: (employeeType: string) => string
}
export const EmployeeListBody = ({
    t,
    employees,
    startIndex,
    endIndex,
    totalEmployees,
    itemsPerPage,
    currentPage,
    totalPages,
    setItemsPerPage,
    setCurrentPage,
    handleViewEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    translateStatus,
    translateDepartment,
    translateEmployeeType
}: EmployeeListBodyProps) => {

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
                                        {translateStatus(employee.status!)}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-2">
                                        <Building className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">
                                            {employee.position} - {translateDepartment(employee.department!)}
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
                                            {translateEmployeeType(employee.employeeType!)}
                                        </Badge>
                                    </div>
                                    <span className="text-sm font-medium">{employee.salary}</span>
                                </div>
                            </div>

                            {/* Actions Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="ml-2">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
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
            <Card className="p-4">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                        {t("employees.pagination.showing")} {startIndex}-{endIndex} {t("employees.pagination.of")}{" "}
                        {totalEmployees} {t("employees.pagination.employees")}
                    </div>

                    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm text-muted-foreground">{t("employees.pagination.itemsPerPage")}</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(Number.parseInt(value))
                                    setCurrentPage(1)
                                }}
                            >
                                <SelectTrigger className="w-16">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                    </div>
                </div>
            </Card>
        </>
    )
}