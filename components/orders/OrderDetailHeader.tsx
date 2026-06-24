import { ArrowLeft, Edit, Printer, Send, MoreVertical, PackageCheck } from "lucide-react"
import Link from "next/link"
import { ADMIN_ROUTES } from "@/constants/nav"
import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getOrderStatusColor } from "@/lib/utils"
import { Order } from "@/types"
import { useLanguage } from "@/contexts/language-context"

interface OrderDetailHeaderProps {
    orderData: Order
    setShowEditModal: (show: boolean) => void
    handlePrint: () => void
    handleCompleteOrder: () => void
    getStatusText: (status: string) => string
}

export const OrderDetailHeader = ({ orderData, setShowEditModal, handlePrint, handleCompleteOrder, getStatusText }: OrderDetailHeaderProps) => {
    const { t } = useLanguage()
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Link href={ADMIN_ROUTES.orders()}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("orders.backToOrders")}</span>
                        <span className="sm:hidden">{t("orders.backToOrders")}</span>
                    </Button>
                </Link>
                <div className="hidden md:flex space-x-2">
                    <Button className={`${orderData.status === "completed" && 'hidden'}`} variant="outline" onClick={handleCompleteOrder}>
                        <PackageCheck className="mr-2 h-4 w-4" />
                        {t("orders.completeOrder")}
                    </Button>
                    <Button className={`${orderData.status === "completed" && 'hidden'}`} variant="outline" onClick={() => setShowEditModal(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("orders.editOrder")}
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        {t("orders.printInvoice")}
                    </Button>
                    <Button variant="outline">
                        <Send className="mr-2 h-4 w-4" />
                        {t("orders.sendInvoice")}
                    </Button>
                </div>
                <div className="md:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleCompleteOrder}>
                                <PackageCheck className="mr-2 h-4 w-4" />
                                {t("orders.completeOrder")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t("orders.editOrder")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                {t("orders.printInvoice")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                {t("orders.sendInvoice")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        #{orderData?.number}
                    </h2>
                    <Badge className={getOrderStatusColor(orderData?.status!)}>{getStatusText(orderData?.status!)}</Badge>
                </div>
            </div>
        </div>
    )
}
