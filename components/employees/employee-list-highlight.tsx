import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Building, UserX } from "lucide-react"

interface EmployeeListHighlightProps {
    t: (key: string) => string
    totalEmployees: number
    activeEmployees: number
    departments: number
    onLeave: number
}
export const EmployeeListHighlight = ({ t, totalEmployees, activeEmployees, departments, onLeave }: EmployeeListHighlightProps) => {

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <Card className="p-3 sm:p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.totalEmployees")}</CardTitle>
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0 pt-2">
                    <div className="text-lg sm:text-2xl font-bold">{totalEmployees}</div>
                    <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.registeredEmployees")}</p>
                </CardContent>
            </Card>

            <Card className="p-3 sm:p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.activeEmployees")}</CardTitle>
                    <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0 pt-2">
                    <div className="text-lg sm:text-2xl font-bold">{activeEmployees}</div>
                    <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.currentlyActive")}</p>
                </CardContent>
            </Card>

            <Card className="p-3 sm:p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.departments")}</CardTitle>
                    <Building className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0 pt-2">
                    <div className="text-lg sm:text-2xl font-bold">{departments}</div>
                    <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.totalDepartments")}</p>
                </CardContent>
            </Card>

            <Card className="p-3 sm:p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0">
                    <CardTitle className="text-xs sm:text-sm font-medium">{t("employees.onLeave")}</CardTitle>
                    <UserX className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-0 pt-2">
                    <div className="text-lg sm:text-2xl font-bold">{onLeave}</div>
                    <p className="text-xs text-muted-foreground hidden sm:block">{t("employees.employeesOnLeave")}</p>
                </CardContent>
            </Card>
        </div>
    )
}