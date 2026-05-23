import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, User, Clock, DollarSign, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EmployeeReportPage() {
  const employeeData = [
    {
      id: "EMP-001",
      name: "Robert Vo",
      department: "IT",
      position: "Manager",
      attendanceRate: 98,
      hoursWorked: 168,
      overtimeHours: 12,
      salary: 5600,
      performance: "Excellent",
      tasksCompleted: 45,
      projectsLed: 3,
    },
    {
      id: "EMP-002",
      name: "Nguyen Van A",
      department: "IT",
      position: "Developer",
      attendanceRate: 95,
      hoursWorked: 160,
      overtimeHours: 8,
      salary: 3775,
      performance: "Good",
      tasksCompleted: 38,
      projectsLed: 1,
    },
    {
      id: "EMP-003",
      name: "Tran Thi B",
      department: "Marketing",
      position: "Designer",
      attendanceRate: 92,
      hoursWorked: 155,
      overtimeHours: 5,
      salary: 3180,
      performance: "Good",
      tasksCompleted: 32,
      projectsLed: 2,
    },
    {
      id: "EMP-004",
      name: "Le Van C",
      department: "Finance",
      position: "Accountant",
      attendanceRate: 100,
      hoursWorked: 160,
      overtimeHours: 0,
      salary: 3204,
      performance: "Excellent",
      tasksCompleted: 28,
      projectsLed: 0,
    },
    {
      id: "EMP-005",
      name: "Pham Thi D",
      department: "HR",
      position: "HR Specialist",
      attendanceRate: 88,
      hoursWorked: 148,
      overtimeHours: 3,
      salary: 2916,
      performance: "Average",
      tasksCompleted: 25,
      projectsLed: 1,
    },
  ]

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Good":
        return "bg-blue-100 text-blue-800"
      case "Average":
        return "bg-yellow-100 text-yellow-800"
      case "Poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return "text-green-600"
    if (rate >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const totalSalary = employeeData.reduce((sum, emp) => sum + emp.salary, 0)
  const avgAttendance = Math.round(employeeData.reduce((sum, emp) => sum + emp.attendanceRate, 0) / employeeData.length)
  const totalOvertime = employeeData.reduce((sum, emp) => sum + emp.overtimeHours, 0)

  return (
    <ERPLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Employee Report (Mock Data)</h2>
            <p className="text-muted-foreground">Comprehensive employee performance and attendance analysis</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeData.length}</div>
              <p className="text-xs text-muted-foreground">Active employees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSalary)}</div>
              <p className="text-xs text-muted-foreground">Monthly cost</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOvertime}h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Performance Overview</CardTitle>
            <CardDescription>Detailed performance metrics for all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeeData.map((employee) => (
                <div key={employee.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" alt={employee.name} />
                      <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-sm font-medium">{employee.name}</h3>
                        <Badge className={getPerformanceColor(employee.performance)}>{employee.performance}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {employee.position} - {employee.department}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(employee.salary)}</div>
                      <div className="text-xs text-muted-foreground">Monthly salary</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className={`font-bold ${getAttendanceColor(employee.attendanceRate)}`}>
                        {employee.attendanceRate}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Hours Worked</p>
                      <p className="font-medium">{employee.hoursWorked}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Overtime</p>
                      <p className="font-medium">{employee.overtimeHours}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Tasks Done</p>
                      <p className="font-medium">{employee.tasksCompleted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Projects Led</p>
                      <p className="font-medium">{employee.projectsLed}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Efficiency</p>
                      <p className="font-medium">
                        {Math.round((employee.tasksCompleted / employee.hoursWorked) * 10) / 10}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Performance breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["IT", "Marketing", "Finance", "HR"].map((dept) => {
                  const deptEmployees = employeeData.filter((emp) => emp.department === dept)
                  const avgPerformance =
                    deptEmployees.length > 0
                      ? Math.round(
                          deptEmployees.reduce((sum, emp) => sum + emp.attendanceRate, 0) / deptEmployees.length,
                        )
                      : 0
                  const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0)

                  return (
                    <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{dept}</p>
                        <p className="text-xs text-muted-foreground">{deptEmployees.length} employees</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{avgPerformance}% attendance</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(totalSalary)} payroll</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Highest performing employees this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employeeData
                  .sort((a, b) => b.attendanceRate - a.attendanceRate)
                  .slice(0, 4)
                  .map((employee, index) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{employee.attendanceRate}%</p>
                        <p className="text-xs text-muted-foreground">{employee.tasksCompleted} tasks</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ERPLayout>
  )
}
