import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react"

export default function DailyReportPage() {
  const dailyData = {
    date: "January 15, 2024",
    sales: {
      totalRevenue: 15420,
      totalOrders: 23,
      averageOrderValue: 670,
      newCustomers: 5,
    },
    inventory: {
      stockIn: 1240,
      stockOut: 890,
      lowStockItems: 3,
      outOfStockItems: 1,
    },
    employees: {
      present: 18,
      absent: 2,
      lateArrivals: 1,
      overtimeHours: 12,
    },
    utilities: {
      electricityUsage: 85,
      waterUsage: 5.2,
      gasUsage: 2.8,
      totalCost: 42,
    },
  }

  const topProducts = [
    { name: "Laptop Dell XPS 13", sold: 5, revenue: 6495 },
    { name: "iPhone 15 Pro", sold: 3, revenue: 4497 },
    { name: "Office Chair", sold: 8, revenue: 3192 },
    { name: "Wireless Mouse", sold: 12, revenue: 420 },
  ]

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  return (
    <ERPLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Daily Report</h2>
            <p className="text-muted-foreground">Comprehensive daily business overview for {dailyData.date}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Change Date
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Sales Performance</span>
              </CardTitle>
              <CardDescription>Revenue and order metrics for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(dailyData.sales.totalRevenue)}</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +12.5% from yesterday
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{dailyData.sales.totalOrders}</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +8.2% from yesterday
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                  <p className="text-2xl font-bold">{formatCurrency(dailyData.sales.averageOrderValue)}</p>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    -3.1% from yesterday
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">New Customers</p>
                  <p className="text-2xl font-bold">{dailyData.sales.newCustomers}</p>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +25% from yesterday
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span>Inventory Movement</span>
              </CardTitle>
              <CardDescription>Stock in/out and inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Stock In</p>
                  <p className="text-2xl font-bold text-green-600">{dailyData.inventory.stockIn}</p>
                  <p className="text-xs text-muted-foreground">Units received</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Stock Out</p>
                  <p className="text-2xl font-bold text-red-600">{dailyData.inventory.stockOut}</p>
                  <p className="text-xs text-muted-foreground">Units shipped</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{dailyData.inventory.lowStockItems}</p>
                  <p className="text-xs text-muted-foreground">Items below minimum</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{dailyData.inventory.outOfStockItems}</p>
                  <p className="text-xs text-muted-foreground">Items unavailable</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Employee Attendance</CardTitle>
              <CardDescription>Staff attendance and working hours summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-green-600">{dailyData.employees.present}</p>
                  <p className="text-xs text-muted-foreground">Employees at work</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{dailyData.employees.absent}</p>
                  <p className="text-xs text-muted-foreground">Employees absent</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Late Arrivals</p>
                  <p className="text-2xl font-bold text-yellow-600">{dailyData.employees.lateArrivals}</p>
                  <p className="text-xs text-muted-foreground">Late today</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Overtime Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{dailyData.employees.overtimeHours}</p>
                  <p className="text-xs text-muted-foreground">Extra hours worked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Utility Consumption</CardTitle>
            <CardDescription>Daily utility usage and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Electricity</p>
                <p className="text-xl font-bold">{dailyData.utilities.electricityUsage} kWh</p>
                <p className="text-xs text-muted-foreground">Daily usage</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Water</p>
                <p className="text-xl font-bold">{dailyData.utilities.waterUsage} m³</p>
                <p className="text-xs text-muted-foreground">Daily usage</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Gas</p>
                <p className="text-xl font-bold">{dailyData.utilities.gasUsage} m³</p>
                <p className="text-xs text-muted-foreground">Daily usage</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-xl font-bold">{formatCurrency(dailyData.utilities.totalCost)}</p>
                <p className="text-xs text-muted-foreground">Daily expense</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  )
}
