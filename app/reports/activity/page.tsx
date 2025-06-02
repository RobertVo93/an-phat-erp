"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts"
import { CalendarIcon, Download, Filter, TrendingUp, Factory, Package, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

// Sample data
const productionTrendData = [
  { date: "01/01", noodles: 120, cost: 850, efficiency: 85, revenue: 1200, profit: 350 },
  { date: "02/01", noodles: 135, cost: 920, efficiency: 88, revenue: 1350, profit: 430 },
  { date: "03/01", noodles: 145, cost: 980, efficiency: 90, revenue: 1450, profit: 470 },
  { date: "04/01", noodles: 160, cost: 1050, efficiency: 92, revenue: 1600, profit: 550 },
  { date: "05/01", noodles: 140, cost: 950, efficiency: 87, revenue: 1400, profit: 450 },
  { date: "06/01", noodles: 250, cost: 1660, efficiency: 90, revenue: 2500, profit: 840 },
  { date: "07/01", noodles: 180, cost: 1200, efficiency: 89, revenue: 1800, profit: 600 },
  { date: "08/01", noodles: 165, cost: 1100, efficiency: 91, revenue: 1650, profit: 550 },
  { date: "09/01", noodles: 175, cost: 1150, efficiency: 88, revenue: 1750, profit: 600 },
  { date: "10/01", noodles: 190, cost: 1250, efficiency: 93, revenue: 1900, profit: 650 },
]

const costBreakdownData = [
  { name: "Nguyên liệu", value: 4500, color: "#8884d8", percentage: 45 },
  { name: "Tiện ích", value: 2300, color: "#82ca9d", percentage: 23 },
  { name: "Nhân công", value: 2200, color: "#ffc658", percentage: 22 },
  { name: "Chi phí khác", value: 1000, color: "#ff7300", percentage: 10 },
]

const departmentProductionData = [
  { department: "Sản xuất A", production: 850, cost: 5200, efficiency: 92 },
  { department: "Sản xuất B", production: 720, cost: 4800, efficiency: 88 },
  { department: "Sản xuất C", production: 650, cost: 4200, efficiency: 85 },
  { department: "Kiểm soát chất lượng", production: 0, cost: 800, efficiency: 95 },
]

const monthlyComparisonData = [
  { month: "T1", thisYear: 3200, lastYear: 2800, growth: 14.3 },
  { month: "T2", thisYear: 3450, lastYear: 3100, growth: 11.3 },
  { month: "T3", thisYear: 3800, lastYear: 3200, growth: 18.8 },
  { month: "T4", thisYear: 4100, lastYear: 3600, growth: 13.9 },
  { month: "T5", thisYear: 4350, lastYear: 3800, growth: 14.5 },
  { month: "T6", thisYear: 4200, lastYear: 3900, growth: 7.7 },
]

const productPerformanceData = [
  { product: "Mì Gạo", quantity: 1200, revenue: 18000, cost: 12000, profit: 6000, margin: 33.3 },
  { product: "Mì Lúa Mì", quantity: 800, revenue: 14400, cost: 9600, profit: 4800, margin: 33.3 },
  { product: "Bánh Phở", quantity: 600, revenue: 12000, cost: 7800, profit: 4200, margin: 35.0 },
  { product: "Mì Ăn Liền", quantity: 2000, revenue: 16000, cost: 11000, profit: 5000, margin: 31.3 },
]

export default function ActivityReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 0, 31),
  })
  const [reportPeriod, setReportPeriod] = useState("month")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000).toFixed(1)}K đ`
  }

  const formatLargeCurrency = (amount: number) => {
    return `${amount.toLocaleString()} đ`
  }

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Báo Cáo Hoạt Động</h2>
            <p className="text-muted-foreground">Phân tích chi tiết hoạt động sản xuất và kinh doanh</p>
          </div>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Chọn khoảng thời gian</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Kỳ báo cáo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="quarter">Quý</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Lọc
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Xuất Báo Cáo
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Sản Lượng</CardTitle>
              <Factory className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,650 kg</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+12.5% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Doanh Thu</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16.5M đ</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+8.2% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Chi Phí</CardTitle>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">11.2M đ</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">+5.1% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lợi Nhuận</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.3M đ</div>
              <div className="flex items-center text-xs">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+15.8% so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different report views */}
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="production">Sản Xuất</TabsTrigger>
            <TabsTrigger value="financial">Tài Chính</TabsTrigger>
            <TabsTrigger value="comparison">So Sánh</TabsTrigger>
            <TabsTrigger value="products">Sản Phẩm</TabsTrigger>
          </TabsList>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Xu Hướng Sản Xuất & Hiệu Suất</CardTitle>
                  <CardDescription>Sản lượng và hiệu suất sản xuất theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={productionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis yAxisId="left" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" fontSize={12} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="noodles" fill="#8884d8" name="Sản lượng (kg)" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#ff7300"
                        strokeWidth={2}
                        name="Hiệu suất (%)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sản Xuất Theo Bộ Phận</CardTitle>
                  <CardDescription>Hiệu suất sản xuất của từng bộ phận</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={departmentProductionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" fontSize={10} angle={-45} textAnchor="end" height={80} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Area dataKey="production" stackId="1" stroke="#8884d8" fill="#8884d8" name="Sản lượng (kg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Xu Hướng Chi Phí & Doanh Thu</CardTitle>
                  <CardDescription>Phân tích chi phí và doanh thu theo thời gian</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={productionTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area dataKey="revenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Doanh thu" />
                      <Area dataKey="cost" stackId="1" stroke="#8884d8" fill="#8884d8" name="Chi phí" />
                      <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={3} name="Lợi nhuận" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Phân Tích Chi Phí</CardTitle>
                  <CardDescription>Cơ cấu chi phí sản xuất</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        fontSize={12}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatLargeCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle>Chi Tiết Chi Phí</CardTitle>
                <CardDescription>Phân tích chi tiết từng loại chi phí</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costBreakdownData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.percentage}% tổng chi phí</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatLargeCurrency(item.value)}</p>
                        <p className="text-sm text-gray-600">
                          {((item.value / costBreakdownData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>So Sánh Theo Tháng</CardTitle>
                <CardDescription>So sánh sản lượng năm nay với năm trước</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={monthlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="lastYear" fill="#94a3b8" name="Năm trước (kg)" />
                    <Bar dataKey="thisYear" fill="#3b82f6" name="Năm nay (kg)" />
                    <Line type="monotone" dataKey="growth" stroke="#ef4444" strokeWidth={2} name="Tăng trưởng (%)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiệu Suất Sản Phẩm</CardTitle>
                <CardDescription>Phân tích hiệu suất và lợi nhuận từng sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformanceData.map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{product.product}</h3>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Biên lợi nhuận</p>
                          <p className="font-bold text-green-600">{product.margin}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Sản lượng</p>
                          <p className="font-medium">{product.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Doanh thu</p>
                          <p className="font-medium">{formatLargeCurrency(product.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Chi phí</p>
                          <p className="font-medium">{formatLargeCurrency(product.cost)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Lợi nhuận</p>
                          <p className="font-medium text-green-600">{formatLargeCurrency(product.profit)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ERPLayout>
  )
}
