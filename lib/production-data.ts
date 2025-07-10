import type {
  Employee,
  DailyProductionData,
  CostBreakdownData,
  Utility,
} from "@/types/production"


export const availableUtilities: Utility[] = [
  { id: "electricity", name: "Điện", unit: "kWh", cost: 3500 },
  { id: "gas", name: "Gas", unit: "m³", cost: 15000 },
  { id: "water-utility", name: "Nước (tiện ích)", unit: "m³", cost: 12000 },
  { id: "steam", name: "Hơi nước", unit: "kg", cost: 8000 },
]

export const availableEmployees: Employee[] = [
  {
    id: "emp001",
    name: "Nguyễn Văn A",
    position: "Trưởng ca",
    hourlyRate: 85000,
    department: "Sản xuất",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp002",
    name: "Trần Thị B",
    position: "Công nhân",
    hourlyRate: 65000,
    department: "Sản xuất",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp003",
    name: "Lê Văn C",
    position: "Kỹ thuật viên",
    hourlyRate: 75000,
    department: "Kỹ thuật",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp004",
    name: "Phạm Thị D",
    position: "Công nhân",
    hourlyRate: 60000,
    department: "Sản xuất",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "emp005",
    name: "Hoàng Văn E",
    position: "Kiểm soát chất lượng",
    hourlyRate: 80000,
    department: "QC",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export const dailyProductionData: DailyProductionData[] = [
  { date: "10/01", noodles: 120, cost: 850, efficiency: 85 },
  { date: "11/01", noodles: 135, cost: 920, efficiency: 88 },
  { date: "12/01", noodles: 145, cost: 980, efficiency: 90 },
  { date: "13/01", noodles: 160, cost: 1050, efficiency: 92 },
  { date: "14/01", noodles: 140, cost: 950, efficiency: 87 },
  { date: "15/01", noodles: 250, cost: 1660, efficiency: 90 },
]

export const costBreakdownData: CostBreakdownData[] = [
  { name: "Nguyên liệu", value: 270, color: "#8884d8" },
  { name: "Tiện ích", value: 230, color: "#82ca9d" },
  { name: "Nhân công", value: 720, color: "#ffc658" },
  { name: "Chi phí khác", value: 180, color: "#ff7300" },
]
