import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Customer, CustomerStatus, CustomerType } from "@/types"
import { formatCurrency } from "@/lib/utils"

interface ICustomerListHighlightProps {
    t: (key: string) => string
    allCustomers: Customer[]
    totalRevenue: number
}
export const CustomerListHighlight = ({ t, allCustomers, totalRevenue }: ICustomerListHighlightProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">{t("customers.totalCustomers")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="text-xl md:text-2xl font-bold">{allCustomers.length}</div>
                    <p className="text-xs text-muted-foreground hidden md:block">{t("customers.registeredCustomers")}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">{t("customers.activeCustomers")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="text-xl md:text-2xl font-bold">
                        {allCustomers.filter((c) => c.status === CustomerStatus.active).length}
                    </div>
                    <p className="text-xs text-muted-foreground hidden md:block">{t("customers.currentlyActive")}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">{t("customers.totalRevenue")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="text-xl md:text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground hidden md:block">{t("customers.fromAllCustomers")}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">{t("customers.vipCustomers")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="text-xl md:text-2xl font-bold">
                        {allCustomers.filter((c) => c.customerType === CustomerType.vip).length}
                    </div>
                    <p className="text-xs text-muted-foreground hidden md:block">{t("customers.premiumTierCustomers")}</p>
                </CardContent>
            </Card>
        </div>
    )
}