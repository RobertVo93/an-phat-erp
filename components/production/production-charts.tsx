import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "recharts"
import type { DailyProductionData, CostBreakdownData } from "@/types/production"

interface ProductionChartsProps {
  dailyData: DailyProductionData[]
  costBreakdown: CostBreakdownData[]
}

export function ProductionCharts({ dailyData, costBreakdown }: ProductionChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Xu Hướng Sản Xuất & Chi Phí</CardTitle>
          <CardDescription className="text-sm">Sản lượng và chi phí liên quan theo thời gian</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis yAxisId="left" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" fontSize={12} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="noodles" fill="#8884d8" name="Sản lượng (kg)" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cost"
                stroke="#ff7300"
                strokeWidth={2}
                name="Chi phí (đ)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Phân Tích Chi Phí</CardTitle>
          <CardDescription className="text-sm">Phân bổ chi phí sản xuất</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                fontSize={12}
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
