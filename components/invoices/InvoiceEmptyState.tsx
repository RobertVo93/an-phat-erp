import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import React from "react"
import { useLanguage } from "@/contexts/language-context"

interface InvoiceEmptyStateProps {
    onCreate: () => void
}

export const InvoiceEmptyState: React.FC<InvoiceEmptyStateProps> = ({ onCreate }) => {
    const { t } = useLanguage()
    return (
        <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t("invoices.noInvoice")}</h3>
            <p className="mt-1 text-sm text-gray-500">
                {t("invoices.noInvoiceDescription")}
            </p>

            <Button onClick={onCreate} className="mt-4">
                <FileText className="mr-2 h-4 w-4" />
                {t("invoices.create")}
            </Button>
        </div>
    )
}
