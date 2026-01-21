"use client"

import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { ERPLayout } from "@/components/erp-layout"
import { OrdersCardList } from "@/components/orders/OrdersCardList"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ADMIN_ROUTES } from "@/constants"
import { useLanguage } from "@/contexts/language-context"
import { useCustomer } from "@/hooks/use-customer"
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils"
import { getCustomerStatusColor, getCustomerTypeColor, getOrderStatusColor } from "@/lib/utils.style"
import { translateCustomerStatus, translateCustomerType } from "@/lib/utils.translate"
import { ArrowLeft, Building, Calendar, DollarSign, Mail, MapPin, Phone, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { notFound, useParams } from "next/navigation"
import { useCallback } from "react"

export default function Page() {
  const { t } = useLanguage()
  const params = useParams()

  const {
    loading,
    notFoundError,
    customer,
    orders,
    total,
    totalPages,
    currentPage,
    sortBy,
    sortOrder,

    handlePageChange,
    handleSort
  } = useCustomer(params.id as string)
  const getStatusText = useCallback((status: string) => t(`orders.status.${status}`), [t])

  const columns: ServersideTableColumn<any>[] = [
    {
      key: "number",
      title: t("orders.number"),
      sortable: true,
      render: (row) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.number}</p>
          <p className="text-xs text-muted-foreground">{formatDate(row.createdAt)}</p>
        </div>
      ),
    },
    {
      key: "status",
      title: t("orders.status"),
      render: (row) => (
        <Badge className={getOrderStatusColor(row.status)}>{getStatusText(row.status)}</Badge>
      ),
    },
    {
      key: "paymentStatus",
      title: t("orders.payment"),
      render: (row) => (
        <Badge variant="outline">{t(`orders.paymentStatus.${row.paymentStatus}`)}</Badge>
      ),
    },
    {
      key: "totalAmount",
      title: t("orders.amount"),
      sortable: true,
      render: (row) => <span className="font-medium">{formatCurrency(row.totalAmount)}</span>,
    },
    {
      key: "deliveryDate",
      title: t("orders.expectedDelivery"),
      sortable: true,
      render: (row) => row.deliveryDate ? formatDateTime(row.deliveryDate) : "-",
    },
  ]

  if (notFoundError) return notFound()

  if (!customer) return null

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />

      <div className="space-y-6">
        <div className="space-y-4 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{t("customers.detail.customerDetail")}</h2>
          <div className="flex items-center justify-between">
            <Link href={ADMIN_ROUTES.customers()}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{t("customers.detail.backToCustomers")}</span>
                <span className="sm:hidden">{t("customers.detail.backToCustomers")}</span>
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{customer.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {customer.number}</p>
              </div>
              <div className="flex space-x-2">
                <Badge className={getCustomerStatusColor(customer.status!.toString())}>
                  {translateCustomerStatus(customer.status!.toString(), t)}
                </Badge>
                <Badge variant="outline" className={getCustomerTypeColor(customer.customerType!.toString())}>
                  {translateCustomerType(customer.customerType!.toString(), t)}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg">{t("customers.form.contactInfo")}</h4>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.email || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone || "N/A"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.location || "N/A"}</span>
                </div>

                {customer.company && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.company || "N/A"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg">{t("customers.form.customerDetails")}</h4>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("customers.joined")}: {formatDate(customer.joinDate)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {customer.orders?.length || 0} {t("customers.orders")}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatCurrency(customer.totalSpend || 0)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {t("customers.lastOrder")}: {customer.lastOrder ? new Date(customer.lastOrder.toString().replace(" ", "T")).toLocaleDateString("sv-SE") : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="space-y-2">
                <h4 className="font-semibold">{t("customers.form.notes")}</h4>
                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-2xl font-bold">{t('customers.detail.addresses')}</h3>
            <div className="p-0">
              {orders.length === 0 ? (
                <div>
                  {t('customers.detail.noAddress')}
                </div>
              ) : (
                <div className="space-y-6">
                  {customer.addresses?.map((address, index) => (
                    <Card className="p-4" key={index} >
                      <div className="font-bold">{address.name} - {address.phone}</div>
                      <div>{address.street} - {address.ward} - {address.city}</div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="text-2xl font-bold">{t('customers.detail.orders')}</h3>
            <div className="p-0">
              {orders.length === 0 ? (
                <div>
                  {t('customers.detail.noOrders')}
                </div>
              ) : (
                <>
                  <div className="hidden lg:block mt-6">
                    <ServersideTable
                      columns={columns}
                      data={orders}
                      total={total}
                      currentPage={currentPage}
                      pageSize={20}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onPageChange={handlePageChange}
                      onSort={handleSort}
                      loading={loading}
                      totalPages={totalPages}
                    />
                  </div>
                  <div className="lg:hidden mt-6">
                    <OrdersCardList
                      orders={orders}
                      getStatusText={getStatusText}
                    />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  )
}