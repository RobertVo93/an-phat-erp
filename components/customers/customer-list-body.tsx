import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Edit, Trash2, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Customer, CustomerStatus, CustomerType } from "@/types"
import { formatCurrency, formatDate, getCustomerInitialCharacter, getCustomerStatusColor, getCustomerTypeColor } from "@/lib/utils"

interface ICustomerListBodyProps {
    t: (key: string) => string
    customers: Customer[]
    totalCustomers: number
    startIndex: number
    endIndex: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
    setItemsPerPage: (itemsPerPage: number) => void
    getVisiblePages: () => (string | number)[]
    handleViewCustomer: (customer: Customer) => void
    handleEditCustomer: (customer: Customer) => void
    handleDeleteCustomer: (customer: Customer) => void
}
export const CustomerListBody = ({
    t,
    customers,
    totalCustomers,
    startIndex,
    endIndex,
    itemsPerPage,
    totalPages,
    currentPage,
    setCurrentPage,
    setItemsPerPage,
    getVisiblePages,
    handleViewCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
}: ICustomerListBodyProps) => {

  const translateStatus = (status: string) => {
    switch (status) {
      case CustomerStatus.active:
        return t("customers.status.active")
      case CustomerStatus.inactive:
        return t("customers.status.inactive")
      case CustomerStatus.pending:
        return t("customers.status.pending")
      default:
        return status
    }
  }

  const translateCustomerType = (type: string) => {
    switch (type) {
      case CustomerType.vip:
        return t("customers.type.vip")
      case CustomerType.premium:
        return t("customers.type.premium")
      case CustomerType.regular:
        return t("customers.type.regular")
      default:
        return type
    }
  }
    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle className="text-lg md:text-xl">{t("customers.customerDirectory")}</CardTitle>
                        <CardDescription className="hidden md:block">
                            {t("customers.customerDirectoryDescription")}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-2">
                        <span className="text-xs md:text-sm text-muted-foreground">
                            {startIndex}-{endIndex} / {totalCustomers}
                        </span>
                        <div className="flex items-center space-x-2">
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                            >
                                <SelectTrigger className="w-16 md:w-20 h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">/{t("customers.pagination.itemsPerPage")}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {customers.map((customer) => (
                        <div key={customer.id} className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start space-x-3">
                                <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                                    <AvatarImage src="/placeholder.svg" alt={customer.name} />
                                    <AvatarFallback className="text-xs">{getCustomerInitialCharacter(customer.name!)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0 space-y-2">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium truncate">{customer.name}</h3>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                <Badge className={`text-xs ${getCustomerStatusColor(customer.status!)}`}>
                                                    {translateStatus(customer.status!)}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getCustomerTypeColor(customer.customerType!)}`}
                                                >
                                                    {translateCustomerType(customer.customerType!)}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Actions Dropdown */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    {t("customers.viewCustomer")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    {t("customers.editCustomer")}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteCustomer(customer)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    {t("customers.deleteCustomer")}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Contact Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2 text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-1 truncate">
                                            <Mail className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{customer.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 truncate">
                                            <Phone className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{customer.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 truncate">
                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{customer.location}</span>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                        <div>
                                            <span className="text-muted-foreground">{t("customers.orders")}:</span>
                                            <span className="ml-1 font-medium">{customer.orders?.length}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">{t("customers.spending")}:</span>
                                            <span className="ml-1 font-medium text-green-600">{formatCurrency(customer.totalSpend!)}</span>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <span className="text-muted-foreground">{t("customers.lastOrder")}:</span>
                                            <span className="ml-1">{customer.lastOrder ? formatDate(customer.lastOrder?.toString()) : ""}</span>
                                        </div>
                                        <div className="col-span-2 md:col-span-1">
                                            <span className="text-muted-foreground">{t("customers.joined")}:</span>
                                            <span className="ml-1">{formatDate(customer.joinDate?.toString()!)}</span>
                                        </div>
                                    </div>

                                    {/* Company Info */}
                                    {customer.company && (
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-medium">{t("customers.company")}:</span> {customer.company}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-center md:space-x-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="w-full md:w-auto"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            <span className="md:hidden">{t("customers.pagination.previous")}</span>
                            <span className="hidden md:inline">{t("customers.pagination.previous")}</span>
                        </Button>

                        <div className="flex items-center justify-center space-x-1">
                            {getVisiblePages().map((page, index) => (
                                <Button
                                    key={index}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                                    disabled={typeof page !== "number"}
                                    className="w-8 h-8 p-0"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="w-full md:w-auto"
                        >
                            <span className="md:hidden">{t("customers.pagination.next")}</span>
                            <span className="hidden md:inline">{t("customers.pagination.next")}</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}