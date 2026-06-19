import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Customer } from "@/types"
import { formatCurrency, formatDate, getCustomerInitialCharacter, getCustomerStatusColor, getCustomerTypeColor } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import CustomerActions from "@/components/customers/customer-actions"
import { useRouter } from "next/navigation"
import { ADMIN_ROUTES } from "@/constants"
import { translateCustomerStatus, translateCustomerType } from "@/lib/utils.translate"
import { ServersidePagination } from "../common/table/ServersidePagination"
import Link from "next/link"
import { CustomLink } from "../common/custom-link"

interface ICustomerListBodyProps {
    customers: Customer[]
    totalCustomers: number
    totalPages: number
    currentPage: number
    pageSize: number
    setCurrentPage: (page: number) => void
    handleViewCustomer: (customer: Customer) => void
    handleEditCustomer: (customer: Customer) => void
    handleDeleteCustomer: (customer: Customer) => void
}
export const CustomerListBody = ({
    customers,
    totalCustomers,
    totalPages,
    currentPage,
    pageSize,
    setCurrentPage,
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
            <CardContent>
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
                                            <CustomLink href={ADMIN_ROUTES.customerDetail(customer.id!)}>
                                                <h3 className="text-sm font-medium truncate">{customer.name}</h3>
                                            </CustomLink>
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
                                        {customer.email && (
                                            <div className="flex items-center space-x-1 truncate">
                                                <Mail className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                        )}
                                        {customer.phone && (
                                            <div className="flex items-center space-x-1 truncate">
                                                <Phone className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{customer.phone}</span>
                                            </div>
                                        )}
                                        {customer.location && (
                                            <div className="flex items-center space-x-1 truncate">
                                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                                <span className="truncate">{customer.location}</span>
                                            </div>
                                        )}
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
                                        {customer.lastOrder && (
                                            <div className="col-span-2 md:col-span-1">
                                                <span className="text-muted-foreground">{t("customers.lastOrder")}:</span>
                                                <span className="ml-1">{formatDate(customer.lastOrder)}</span>
                                            </div>
                                        )}
                                        <div className="col-span-2 md:col-span-1">
                                            <span className="text-muted-foreground">{t("customers.joined")}:</span>
                                            <span className="ml-1">{formatDate(customer.joinDate)}</span>
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

                <div className="mt-4">
                    <ServersidePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        total={totalCustomers}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </CardContent>
        </Card>
    )
}