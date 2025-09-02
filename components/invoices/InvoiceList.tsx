import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from "react"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice } from "@/types/invoice"
import { InvoiceStatus } from "@/types"
import { MoreHorizontal, Eye, Edit, Download, Send, Printer, Trash2 } from "lucide-react"
import { formatDate, formatLargeCurrency, getInvoiceStatusColor } from "@/lib/utils"

interface InvoiceListProps {
  invoices: Invoice[]
  onView: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete: (invoice: Invoice) => void
  onDownload: (invoice: Invoice) => void
  onSend: (invoice: Invoice) => void
  onPrint: (invoice: Invoice) => void
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSend,
  onPrint,
}) => {
  const { t } = useLanguage()
  return (
    <div className="space-y-4">
      {invoices?.map((invoice) => (
        <div key={invoice.id} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{invoice.number}</h3>
                <Badge className={getInvoiceStatusColor(invoice.status!)}>
                  {t(`invoices.status.${invoice.status}`)}
                </Badge>
              </div>
            </div>

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

          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <span className="text-muted-foreground">{t("invoices.issueDate")}:</span>
              <p className="font-medium">{formatDate(invoice.issueDate!)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("invoices.dueDate")}:</span>
              <p className="font-medium">{formatDate(invoice.dueDate!)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t("invoices.totalMoney")}:</span>
              <p className="font-medium">{formatLargeCurrency(invoice.total!)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
