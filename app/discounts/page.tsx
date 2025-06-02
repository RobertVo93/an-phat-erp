import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Edit, Trash2, Percent, Calendar, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DiscountsPage() {
  const discounts = [
    {
      id: "DISC-001",
      name: "New Year Sale",
      code: "NEWYEAR2024",
      type: "Percentage",
      value: 20,
      minOrder: 100,
      maxDiscount: 50,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      usageCount: 45,
      usageLimit: 100,
      status: "Active",
      category: "Seasonal",
    },
    {
      id: "DISC-002",
      name: "First Time Buyer",
      code: "WELCOME10",
      type: "Percentage",
      value: 10,
      minOrder: 50,
      maxDiscount: 25,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageCount: 128,
      usageLimit: 500,
      status: "Active",
      category: "Customer",
    },
    {
      id: "DISC-003",
      name: "Free Shipping",
      code: "FREESHIP",
      type: "Fixed Amount",
      value: 15,
      minOrder: 75,
      maxDiscount: 15,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      usageCount: 23,
      usageLimit: 200,
      status: "Active",
      category: "Shipping",
    },
    {
      id: "DISC-004",
      name: "VIP Customer Discount",
      code: "VIP25",
      type: "Percentage",
      value: 25,
      minOrder: 200,
      maxDiscount: 100,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      usageCount: 12,
      usageLimit: 50,
      status: "Active",
      category: "VIP",
    },
    {
      id: "DISC-005",
      name: "Christmas Special",
      code: "XMAS2023",
      type: "Percentage",
      value: 30,
      minOrder: 150,
      maxDiscount: 75,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      usageCount: 89,
      usageLimit: 100,
      status: "Expired",
      category: "Seasonal",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Seasonal":
        return "bg-orange-100 text-orange-800"
      case "Customer":
        return "bg-blue-100 text-blue-800"
      case "Shipping":
        return "bg-green-100 text-green-800"
      case "VIP":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDiscount = (type: string, value: number) => {
    return type === "Percentage" ? `${value}%` : `$${value}`
  }

  return (
    <ERPLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Discount Management</h2>
            <p className="text-muted-foreground">Create and manage promotional discounts and coupons</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search discounts..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
              <Percent className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discounts.filter((d) => d.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Tag className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discounts.reduce((sum, d) => sum + d.usageCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Times used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
              <Percent className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18%</div>
              <p className="text-xs text-muted-foreground">Average discount rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Within 7 days</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Discounts</CardTitle>
            <CardDescription>Manage your promotional campaigns and discount codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discounts.map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium">{discount.name}</h3>
                      <Badge className={getStatusColor(discount.status)}>{discount.status}</Badge>
                      <Badge variant="outline" className={getCategoryColor(discount.category)}>
                        {discount.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">{discount.code}</span>
                      <span>{formatDiscount(discount.type, discount.value)} off</span>
                      <span>Min order: ${discount.minOrder}</span>
                      <span>
                        Valid: {discount.startDate} to {discount.endDate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>
                        Usage: {discount.usageCount}/{discount.usageLimit}
                      </span>
                      <span>Max discount: ${discount.maxDiscount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  )
}
