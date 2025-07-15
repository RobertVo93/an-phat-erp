import { useLanguage } from '@/contexts/language-context';
import { ProductionFormat } from '@/types/report-production';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string
  today: number
  yesterday: number
}

interface Props {
  data: ProductionFormat[]
}

function prepareChartData(data: ProductionFormat[]): ChartData[] {
  const grouped: Record<string, number> = {}
  for (const item of data) {
    const day = item.time.slice(0, 10)
    grouped[day] = (grouped[day] || 0) + item.quantity
  }

  const sortedDates = Object.keys(grouped).sort()

  const chartData: ChartData[] = []
  for (let i = 0; i < sortedDates.length; i++) {
    const date = sortedDates[i]
    const prevDate = sortedDates[i - 1]
    chartData.push({
      name: date,
      today: grouped[date],
      yesterday: grouped[prevDate] || 0,
    })
  }

  return chartData
}

export default function ReportChart({ data }: Props) {
  const chartData = prepareChartData(data)
  const { t } = useLanguage()

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#eee" />
        <Bar dataKey="today" barSize={30} fill="#8884d8" name={t(("pro.chart.now"))}/>
        <Line type="monotone" dataKey="yesterday" stroke="#82ca9d" name={t(("pro.chart.previous"))} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
