"use client"

import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInvoices } from "@/hooks/use-invoices"
import { InvoiceFormModal } from "@/components/invoices/invoice-form-modal"
import { InvoiceViewModal } from "@/components/invoices/invoice-view-modal"
import { InvoiceDeleteModal } from "@/components/invoices/invoice-delete-modal"
import { InvoiceHeader } from "@/components/invoices/InvoiceHeader"
import { InvoiceSearchFilterBar } from "@/components/invoices/InvoiceSearchFilterBar"
import { InvoiceList } from "@/components/invoices/InvoiceList"
import { InvoiceServersideTable } from "@/components/invoices/InvoiceServersideTable"
import { InvoiceEmptyState } from "@/components/invoices/InvoiceEmptyState"
import { LoadingOverlay } from "@/components/common/LoadingOverlay"
import { useLanguage } from "@/contexts/language-context"
import type { Invoice } from "@/types/invoice"

export default function InvoicePage() {
  const { t } = useLanguage()
  const {
    invoices,
    searchTerm,
    filters,
    totalRecords,
    totalPages,
    loading,
    allUtilities,
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    selectedInvoice,

    setSearchTerm,
    setFilters,
    resetFilters,
    handleSort,
    handleCreateInvoice,
    handleEditInvoice,
    handleDeleteInvoice,
    onCreateInvoiceClick,
    onEditInvoiceClick,
    onViewInvoiceClick,
    onDeleteInvoiceClick,
    onCloseCreateInvoice,
    onCloseEditInvoice,
    onCloseViewInvoice,
    onCloseDeleteInvoice,
  } = useInvoices()

  const handleDownload = (invoice: Invoice) => {
    // TODO: Download functionality
  }

  const handleSend = (invoice: Invoice) => {
    // TODO: Send functionality
  }

  const handlePrint = (invoice: Invoice) => {
    // TODO: Print functionality
  }

  return (
    <ERPLayout>
      <LoadingOverlay loading={loading} />
      <div className="space-y-6">
        <InvoiceHeader onCreate={onCreateInvoiceClick} />
        <InvoiceSearchFilterBar
          searchTerm={searchTerm}
          filters={filters}
          setSearchTerm={setSearchTerm}
          onReset={resetFilters}
          setFilters={setFilters}
        />

        {/* Desktop View - ServersideTable */}
        <div className="hidden md:block">
          <InvoiceServersideTable
            data={invoices}
            total={totalRecords}
            currentPage={filters.page || 1}
            pageSize={filters.limit || 10}
            sortBy={filters.sortBy || "createdAt"}
            sortOrder={filters.sortOrder || "desc"}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onSort={(field) => handleSort(field as any)}
            loading={loading}
            totalPages={totalPages}
            onView={onViewInvoiceClick}
            onEdit={onEditInvoiceClick}
            onDelete={onDeleteInvoiceClick}
            onDownload={handleDownload}
            onSend={handleSend}
            onPrint={handlePrint}
          />
        </div>

        {/* Mobile View - List */}
        <div className="block md:hidden">
          <Card>
            <CardHeader>
              <CardTitle>{t("invoices.invoiceList")}</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices?.length === 0 ? (
                <InvoiceEmptyState
                  onCreate={onCreateInvoiceClick}
                />
              ) : (
                <InvoiceList
                  invoices={invoices}
                  onView={onViewInvoiceClick}
                  onEdit={onEditInvoiceClick}
                  onDelete={onDeleteInvoiceClick}
                  onDownload={handleDownload}
                  onSend={handleSend}
                  onPrint={handlePrint}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <InvoiceFormModal
          allUtilities={allUtilities}
          isOpen={showCreateModal}
          onClose={onCloseCreateInvoice}
          onSave={handleCreateInvoice}
          mode="create"
        />
        <InvoiceFormModal
          allUtilities={allUtilities}
          isOpen={showEditModal}
          onClose={onCloseEditInvoice}
          onSave={handleEditInvoice}
          invoice={selectedInvoice!}
          mode="update"
        />
        <InvoiceViewModal
          isOpen={showViewModal}
          onClose={onCloseViewInvoice}
          invoice={selectedInvoice}
          onDownload={handleDownload}
          onSend={handleSend}
          onPrint={handlePrint}
        />
        <InvoiceDeleteModal
          isOpen={showDeleteModal}
          onClose={onCloseDeleteInvoice}
          onConfirm={handleDeleteInvoice}
          invoice={selectedInvoice}
        />
      </div>
    </ERPLayout>
  )
}
