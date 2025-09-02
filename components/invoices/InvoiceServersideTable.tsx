import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Download, Send, Printer, Trash2 } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice } from "@/types/invoice"
import { InvoiceStatus } from "@/types"
import { formatDate, formatLargeCurrency, getInvoiceStatusColor } from "@/lib/utils"

interface InvoiceServersideTableProps {
  data: Invoice[]
  total: number
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: "asc" | "desc"
  loading: boolean
  totalPages: number
  onPageChange: (page: number) => void
  onSort: (field: string) => void
  onView: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  onDownload: (invoice: Invoice) => void
  onSend: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

export const InvoiceServersideTable: React.FC<InvoiceServersideTableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  loading,
  totalPages,
  onPageChange,
  onSort,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSend,
  onPrint,
}) => {
  const { t } = useLanguage()

  const columns: ServersideTableColumn<Invoice>[] = [
    {
      key: "number",
      title: t("invoices.number"),
      sortable: true,
      render: (invoice) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{invoice.number}</p>
          <p className="text-xs text-muted-foreground">{formatDate(invoice.createdAt!)}</p>
        </div>
      ),
    },
    {
      key: "billingPeriod",
      title: t("invoices.billingPeriod"),
      sortable: true,
      render: (invoice) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{invoice.billingPeriod}</p>
        </div>
      ),
    },
    {
      key: "issueDate",
      title: t("invoices.issueDate"),
      sortable: true,
      render: (invoice) => <span className="text-sm">{formatDate(invoice.issueDate!)}</span>,
    },
    {
      key: "dueDate",
      title: t("invoices.dueDate"),
      sortable: true,
      render: (invoice) => <span className="text-sm">{formatDate(invoice.dueDate!)}</span>,
    },
    {
      key: "total",
      title: t("invoices.totalMoney"),
      sortable: true,
      render: (invoice) => <span className="font-medium">{formatLargeCurrency(invoice.total!)}</span>,
    },
    {
      key: "status",
      title: t("invoices.status"),
      sortable: true,
      render: (invoice) => (
        <Badge className={getInvoiceStatusColor(invoice.status!)}>
          {t(`invoices.status.${invoice.status}`)}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: t("common.actions"),
      sortable: false,
      render: (invoice) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(invoice)}>
                <Eye className="mr-2 h-4 w-4" />
                {t("invoices.view")}
              </DropdownMenuItem>
              {invoice.status !== InvoiceStatus.paid && (
                <DropdownMenuItem onClick={() => onEdit(invoice)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("invoices.edit")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDownload(invoice)}>
                <Download className="mr-2 h-4 w-4" />
                {t("invoices.download")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSend(invoice)}>
                <Send className="mr-2 h-4 w-4" />
                {t("invoices.send")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(invoice)}>
                <Printer className="mr-2 h-4 w-4" />
                {t("invoices.print")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {t("invoices.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <div className="hidden md:block">
      <ServersideTable
        columns={columns as ServersideTableColumn<{ id: string | number }>[]}
        data={data as { id: string | number }[]}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={onPageChange}
        onSort={onSort}
        loading={loading}
        totalPages={totalPages}
      />
    </div>
  )
}
