"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, Zap, Droplets, Thermometer, Wifi, TrendingUp, TrendingDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts"

export default function UtilityReportPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 1), // October 1, 2023
    to: new Date(2024, 0, 31), // January 31, 2024
  })
  const [reportPeriod, setReportPeriod] = useState("4months")

  const utilityData = [
    {
      type: "Electricity",
      icon: Zap,
      currentMonth: { usage: 2500, cost: 300, unit: "kWh" },
      lastMonth: { usage: 2300, cost: 276, unit: "kWh" },
      yearToDate: { usage: 7200, cost: 864, unit: "kWh" },
      trend: "up",
      efficiency: 85,
    },
    {
      type: "Water",
      icon: Droplets,
      currentMonth: { usage: 150, cost: 375, unit: "m³" },
      lastMonth: { usage: 140, cost: 350, unit: "m³" },
      yearToDate: { usage: 420, cost: 1050, unit: "m³" },
      trend: "up",
      efficiency: 78,
    },
    {
      type: "Gas",
      icon: Thermometer,
      currentMonth: { usage: 80, cost: 144, unit: "m³" },
      lastMonth: { usage: 95, cost: 171, unit: "m³" },
      yearToDate: { usage: 260, cost: 468, unit: "m³" },
      trend: "down",
      efficiency: 92,
    },
    {
      type: "Internet",
      icon: Wifi,
      currentMonth: { usage: 1000, cost: 50, unit: "GB" },
      lastMonth: { usage: 950, cost: 50, unit: "GB" },
      yearToDate: { usage: 2900, cost: 150, unit: "GB" },
      trend: "up",
      efficiency: 88,
    },
  ]

  // Extended monthly data for chart
  const getMonthlyData = () => {
    const baseData = [
      {
        month: "Oct 2023",
        electricity: 2200,
        water: 130,
        gas: 90,
        internet: 900,
        electricityCost: 264,
        waterCost: 325,
        gasCost: 162,
        internetCost: 50,
      },
      {
        month: "Nov 2023",
        electricity: 2300,
        water: 140,
        gas: 95,
        internet: 950,
        electricityCost: 276,
        waterCost: 350,
        gasCost: 171,
        internetCost: 50,
      },
      {
        month: "Dec 2023",
        electricity: 2400,
        water: 145,
        gas: 85,
        internet: 980,
        electricityCost: 288,
        waterCost: 362,
        gasCost: 153,
        internetCost: 50,
      },
      {
        month: "Jan 2024",
        electricity: 2500,
        water: 150,
        gas: 80,
        internet: 1000,
        electricityCost: 300,
        waterCost: 375,
        gasCost: 144,
        internetCost: 50,
      },
    ]

    // Extend data based on selected period
    if (reportPeriod === "6months") {
      return [
        {
          month: "Aug 2023",
          electricity: 2100,
          water: 120,
          gas: 100,
          internet: 850,
          electricityCost: 252,
          waterCost: 300,
          gasCost: 180,
          internetCost: 50,
        },
        {
          month: "Sep 2023",
          electricity: 2150,
          water: 125,
          gas: 95,
          internet: 875,
          electricityCost: 258,
          waterCost: 312,
          gasCost: 171,
          internetCost: 50,
        },
        ...baseData,
      ]
    } else if (reportPeriod === "12months") {
      return [
        {
          month: "Feb 2023",
          electricity: 1900,
          water: 110,
          gas: 120,
          internet: 750,
          electricityCost: 228,
          waterCost: 275,
          gasCost: 216,
          internetCost: 50,
        },
        {
          month: "Mar 2023",
          electricity: 1950,
          water: 115,
          gas: 115,
          internet: 775,
          electricityCost: 234,
          waterCost: 287,
          gasCost: 207,
          internetCost: 50,
        },
        {
          month: "Apr 2023",
          electricity: 2000,
          water: 118,
          gas: 110,
          internet: 800,
          electricityCost: 240,
          waterCost: 295,
          gasCost: 198,
          internetCost: 50,
        },
        {
          month: "May 2023",
          electricity: 2050,
          water: 122,
          gas: 105,
          internet: 825,
          electricityCost: 246,
          waterCost: 305,
          gasCost: 189,
          internetCost: 50,
        },
        {
          month: "Jun 2023",
          electricity: 2080,
          water: 125,
          gas: 102,
          internet: 840,
          electricityCost: 249,
          waterCost: 312,
          gasCost: 183,
          internetCost: 50,
        },
        {
          month: "Jul 2023",
          electricity: 2120,
          water: 128,
          gas: 98,
          internet: 860,
          electricityCost: 254,
          waterCost: 320,
          gasCost: 176,
          internetCost: 50,
        },
        {
          month: "Aug 2023",
          electricity: 2100,
          water: 120,
          gas: 100,
          internet: 850,
          electricityCost: 252,
          waterCost: 300,
          gasCost: 180,
          internetCost: 50,
        },
        {
          month: "Sep 2023",
          electricity: 2150,
          water: 125,
          gas: 95,
          internet: 875,
          electricityCost: 258,
          waterCost: 312,
          gasCost: 171,
          internetCost: 50,
        },
        ...baseData,
      ]
    }

    return baseData
  }

  const monthlyData = getMonthlyData()

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`
  }

  const calculateChange = (current: number, previous: number) => {
    return Math.round(((current - previous) / previous) * 100)
  }

  const totalCurrentCost = utilityData.reduce((sum, utility) => sum + utility.currentMonth.cost, 0)
  const totalLastCost = utilityData.reduce((sum, utility) => sum + utility.lastMonth.cost, 0)
  const totalChange = calculateChange(totalCurrentCost, totalLastCost)

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">
                {entry.dataKey.includes("Cost")
                  ? formatCurrency(entry.value)
                  : `${entry.value} ${getUnitForType(entry.dataKey)}`}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const getUnitForType = (dataKey: string) => {
    if (dataKey.includes("electricity")) return "kWh"
    if (dataKey.includes("water")) return "m³"
    if (dataKey.includes("gas")) return "m³"
    if (dataKey.includes("internet")) return "GB"
    return ""
  }

  return (
    <ERPLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Utility Report</h2>
            <p className="text-muted-foreground">Comprehensive utility consumption and cost analysis</p>
          </div>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
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
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4months">4 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="12months">12 Months</SelectItem>
              </SelectContent>
            </Select>
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
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalCurrentCost)}</div>
              <div className="flex items-center text-xs">
                {totalChange >= 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                )}
                <span className={totalChange >= 0 ? "text-red-500" : "text-green-500"}>
                  {Math.abs(totalChange)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Electricity</CardTitle>
              <Zap className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(utilityData[0].currentMonth.cost)}</div>
              <p className="text-xs text-muted-foreground">{utilityData[0].currentMonth.usage} kWh</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(utilityData[1].currentMonth.cost)}</div>
              <p className="text-xs text-muted-foreground">{utilityData[1].currentMonth.usage} m³</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Efficiency</CardTitle>
              <Thermometer className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(utilityData.reduce((sum, utility) => sum + utility.efficiency, 0) / utilityData.length)}%
              </div>
              <p className="text-xs text-muted-foreground">Energy efficiency</p>
            </CardContent>
          </Card>
        </div>

        {/* Usage Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
            <CardDescription>Monthly utility consumption patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Bars for usage */}
                  <Bar yAxisId="left" dataKey="electricity" fill="#fbbf24" name="Electricity (kWh)" />
                  <Bar yAxisId="left" dataKey="water" fill="#3b82f6" name="Water (m³)" />
                  <Bar yAxisId="left" dataKey="gas" fill="#ef4444" name="Gas (m³)" />
                  <Bar yAxisId="left" dataKey="internet" fill="#10b981" name="Internet (GB)" />

                  {/* Lines for cost trends */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="electricityCost"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Electricity Cost ($)"
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="waterCost"
                    stroke="#2563eb"
                    strokeWidth={3}
                    name="Water Cost ($)"
                    dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
            <CardDescription>Monthly utility costs breakdown and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />

                  {/* Stacked bars for costs */}
                  <Bar dataKey="electricityCost" stackId="cost" fill="#fbbf24" name="Electricity Cost" />
                  <Bar dataKey="waterCost" stackId="cost" fill="#3b82f6" name="Water Cost" />
                  <Bar dataKey="gasCost" stackId="cost" fill="#ef4444" name="Gas Cost" />
                  <Bar dataKey="internetCost" stackId="cost" fill="#10b981" name="Internet Cost" />

                  {/* Total cost trend line */}
                  <Line
                    type="monotone"
                    dataKey={(data: any) => data.electricityCost + data.waterCost + data.gasCost + data.internetCost}
                    stroke="#6366f1"
                    strokeWidth={4}
                    name="Total Cost Trend"
                    dot={{ fill: "#6366f1", strokeWidth: 2, r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utility Breakdown</CardTitle>
            <CardDescription>Detailed consumption and cost analysis by utility type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {utilityData.map((utility) => {
                const Icon = utility.icon
                const usageChange = calculateChange(utility.currentMonth.usage, utility.lastMonth.usage)
                const costChange = calculateChange(utility.currentMonth.cost, utility.lastMonth.cost)

                return (
                  <div key={utility.type} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{utility.type}</h3>
                        <p className="text-sm text-muted-foreground">Efficiency: {utility.efficiency}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Current Month</p>
                        <div className="space-y-1">
                          <p className="text-lg font-bold">{formatCurrency(utility.currentMonth.cost)}</p>
                          <p className="text-sm text-muted-foreground">
                            {utility.currentMonth.usage} {utility.currentMonth.unit}
                          </p>
                          <div className="flex items-center text-xs">
                            {usageChange >= 0 ? (
                              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                            )}
                            <span className={usageChange >= 0 ? "text-red-500" : "text-green-500"}>
                              {Math.abs(usageChange)}% usage vs last month
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Last Month</p>
                        <div className="space-y-1">
                          <p className="text-lg font-bold">{formatCurrency(utility.lastMonth.cost)}</p>
                          <p className="text-sm text-muted-foreground">
                            {utility.lastMonth.usage} {utility.lastMonth.unit}
                          </p>
                          <div className="flex items-center text-xs">
                            {costChange >= 0 ? (
                              <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                            )}
                            <span className={costChange >= 0 ? "text-red-500" : "text-green-500"}>
                              {Math.abs(costChange)}% cost change
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Year to Date</p>
                        <div className="space-y-1">
                          <p className="text-lg font-bold">{formatCurrency(utility.yearToDate.cost)}</p>
                          <p className="text-sm text-muted-foreground">
                            {utility.yearToDate.usage} {utility.yearToDate.unit}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Avg: {formatCurrency(Math.round(utility.yearToDate.cost / 3))}/month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  )
}
