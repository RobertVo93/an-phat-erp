import type {
  ProductionRecord,
  Product,
  Material,
  Utility,
  Employee,
  DailyProductionData,
  CostBreakdownData,
} from "@/types/production"

export const productionRecords: ProductionRecord[] = [
  {
    id: "PR001",
    date: "2024-01-15",
    product: "Mì Gạo",
    quantity: 150,
    unit: "kg",
    status: "completed",
    statusText: "Hoàn thành",
    shift: "Sáng",
    operator: "Nguyễn Văn A",
    rawMaterials: [
      { name: "Gạo", quantity: 120, unit: "kg", cost: 240000 },
      { name: "Nước", quantity: 200, unit: "L", cost: 20000 },
      { name: "Muối", quantity: 2, unit: "kg", cost: 10000 },
    ],
    utilities: [
      { name: "Điện", quantity: 45, unit: "kWh", cost: 135000 },
      { name: "Gas", quantity: 15, unit: "m³", cost: 75000 },
      { name: "Nước", quantity: 200, unit: "L", cost: 20000 },
    ],
    labor: {
      hours: 8,
      workers: 3,
      cost: 480000,
    },
    totalCost: 980000,
    efficiency: 92,
  },
  {
    id: "PR002",
    date: "2024-01-15",
    product: "Mì Lúa Mì",
    quantity: 100,
    unit: "kg",
    status: "in-progress",
    statusText: "Đang sản xuất",
    shift: "Chiều",
    operator: "Trần Thị B",
    rawMaterials: [
      { name: "Bột mì", quantity: 80, unit: "kg", cost: 200000 },
      { name: "Nước", quantity: 150, unit: "L", cost: 15000 },
      { name: "Trứng", quantity: 20, unit: "quả", cost: 60000 },
    ],
    utilities: [
      { name: "Điện", quantity: 35, unit: "kWh", cost: 105000 },
      { name: "Gas", quantity: 12, unit: "m³", cost: 60000 },
    ],
    labor: {
      hours: 6,
      workers: 2,
      cost: 240000,
    },
    totalCost: 680000,
    efficiency: 88,
  },
]

export const availableProducts: Product[] = [
  { id: "rice-noodles", name: "Mì Gạo", unit: "kg" },
  { id: "wheat-noodles", name: "Mì Lúa Mì", unit: "kg" },
  { id: "instant-noodles", name: "Mì Ăn Liền", unit: "gói" },
  { id: "pho-noodles", name: "Bánh Phở", unit: "kg" },
]

export const availableMaterials: Material[] = [
  { id: "rice", name: "Gạo", unit: "kg", price: 25000 },
  { id: "wheat-flour", name: "Bột mì", unit: "kg", price: 18000 },
  { id: "water", name: "Nước", unit: "L", price: 5000 },
  { id: "salt", name: "Muối", unit: "kg", price: 8000 },
  { id: "eggs", name: "Trứng", unit: "quả", price: 3500 },
  { id: "oil", name: "Dầu ăn", unit: "L", price: 45000 },
  { id: "starch", name: "Tinh bột", unit: "kg", price: 22000 },
]

export const availableUtilities: Utility[] = [
  { id: "electricity", name: "Điện", unit: "kWh", price: 3500 },
  { id: "gas", name: "Gas", unit: "m³", price: 15000 },
  { id: "water-utility", name: "Nước (tiện ích)", unit: "m³", price: 12000 },
  { id: "steam", name: "Hơi nước", unit: "kg", price: 8000 },
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
