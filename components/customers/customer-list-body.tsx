import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Customer } from "@/types"
import { formatCurrency, formatDate, getCustomerInitialCharacter, getCustomerStatusColor, getCustomerTypeColor } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import CustomerActions from "@/components/customers/customer-actions"
import { useRouter } from "next/navigation"
import { ADMIN_ROUTES } from "@/constants"
import { translateCustomerStatus, translateCustomerType } from "@/lib/utils.translate"

interface ICustomerListBodyProps {
    customers: Customer[]
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
    getVisiblePages: () => (string | number)[]
    handleViewCustomer: (customer: Customer) => void
    handleEditCustomer: (customer: Customer) => void
    handleDeleteCustomer: (customer: Customer) => void
}
export const CustomerListBody = ({
    customers,
    totalPages,
    currentPage,
    setCurrentPage,
    getVisiblePages,
    handleViewCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
}: ICustomerListBodyProps) => {
    const { t } = useLanguage()
    const router = useRouter()

    const onOpenCustomer = (customerId: string) => {
        router.push(ADMIN_ROUTES.customerDetail(customerId))
    }

    return (
        <Card>
            <CardHeader className="pb-3">

            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {customers.map((customer) => (
                        <div 
                            key={customer.id} 
                            className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => onOpenCustomer(customer.id!)}
                        >
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
                                                    {translateCustomerStatus(customer.status!, t)}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getCustomerTypeColor(customer.customerType!)}`}
                                                >
                                                    {translateCustomerType(customer.customerType!, t)}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Actions Dropdown */}
                                        <CustomerActions
                                            customer={customer}
                                            handleViewCustomer={handleViewCustomer}
                                            handleEditCustomer={handleEditCustomer}
                                            handleDeleteCustomer={handleDeleteCustomer}
                                        />
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