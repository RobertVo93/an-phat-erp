"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Send,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Printer,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { useInvoices } from "@/hooks/use-invoices"
import { InvoiceFormModal } from "@/components/invoices/invoice-form-modal"
import { InvoiceViewModal } from "@/components/invoices/invoice-view-modal"
import { InvoiceFilterModal } from "@/components/invoices/invoice-filter-modal"
import { InvoiceDeleteModal } from "@/components/invoices/invoice-delete-modal"
import type { Invoice } from "@/types/invoice"
import { InvoiceStatus } from "@/types"

export default function InvoicePage() {
  const { t } = useLanguage()
  const {
    invoices,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    sortConfig,
    handleSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    resetFilters,
    stats,
    loading,
    allUtilities,
  } = useInvoices()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case InvoiceStatus.paid:
        return "bg-green-100 text-green-800"
      case InvoiceStatus.sent:
        return "bg-blue-100 text-blue-800"
      case InvoiceStatus.partial:
        return "bg-yellow-100 text-yellow-800"
      case InvoiceStatus.overdue:
        return "bg-red-100 text-red-800"
      case InvoiceStatus.draft:
        return "bg-gray-100 text-gray-800"
      case InvoiceStatus.cancelled:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString("vi-VN") + " ₫"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleCreateInvoice = (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    addInvoice(invoiceData)
  }

  const handleEditInvoice = (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">) => {
    if (selectedInvoice) {
      updateInvoice(selectedInvoice.id!, invoiceData)
    }
  }

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice.id!)
    }
  }

  const handleDownload = (invoice: Invoice) => {
    // Mock download functionality
    console.log("Downloading invoice:", invoice.invoiceNumber)
    // In real app, this would generate and download PDF
  }

  const handleSend = (invoice: Invoice) => {
    // Mock send functionality
    console.log("Sending invoice:", invoice.invoiceNumber)
    // In real app, this would send email
  }

  const handlePrint = (invoice: Invoice) => {
    // Mock print functionality
    console.log("Printing invoice:", invoice.invoiceNumber)
    // In real app, this would open print dialog
  }

  const getSortIcon = (field: keyof Invoice) => {
    if (sortConfig.field !== field) return null
    return sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <ERPLayout>
      {loading && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t("invoices.title")}</h2>
            <p className="text-muted-foreground">{t("invoices.description")}</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("invoices.create")}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("invoices.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilterModal(true)} className="relative">
              <Filter className="mr-2 h-4 w-4" />
              {t("invoices.filter")}
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">{activeFiltersCount}</Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={resetFilters} size="sm">
                {t("invoices.removeFilter")}
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("invoices.stats.totalInvoices")}</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">{t("invoices.stats.totalInvoices")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("invoices.stats.totalAmount")}</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(stats.totalAmount)}</div>
              <p className="text-xs text-muted-foreground">{t("invoices.stats.totalAmount")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("invoices.stats.paidAmount")}</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(stats.paidAmount)}</div>
              <p className="text-xs text-muted-foreground">{t("invoices.stats.paidAmount")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("invoices.stats.pendingCount")}</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs text-muted-foreground">{t("invoices.stats.pendingCount")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("invoices.stats.overdueCount")}</CardTitle>
              <FileText className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.overdueCount}</div>
              <p className="text-xs text-muted-foreground">{t("invoices.stats.overdueCount")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Invoice List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>{t("invoices.invoiceList")}</CardTitle>
                <CardDescription>
                  {t("invoices.display")} {invoices?.length} {t("invoices.in")} {totalItems} {t("invoices.invoices")}
                </CardDescription>
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("invoices.sort")}:</span>
                <Select
                  value={`${sortConfig.field}-${sortConfig.direction}`}
                  onValueChange={(value) => {
                    const [field, direction] = value.split("-") as [keyof Invoice, "asc" | "desc"]
                    handleSort(field)
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">{t("invoices.newest")}</SelectItem>
                    <SelectItem value="createdAt-asc">{t("invoices.oldest")}</SelectItem>
                    <SelectItem value="total-desc">{t("invoices.highPrice")}</SelectItem>
                    <SelectItem value="total-asc">{t("invoices.lowPrice")}</SelectItem>
                    <SelectItem value="dueDate-asc">{t("invoices.dueSoon")}</SelectItem>
                    <SelectItem value="dueDate-desc">{t("invoices.dueLate")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="space-y-4">
              {invoices?.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status!)}>
                          {t(`invoices.status.${invoice.status}`)}
                        </Badge>
                      </div>
                      {/* <p className="text-sm text-muted-foreground">{invoice.customerName!}</p> */}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowViewModal(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("invoices.view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowEditModal(true)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("invoices.edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          {t("invoices.download")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSend(invoice)}>
                          <Send className="mr-2 h-4 w-4" />
                          {t("invoices.send")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrint(invoice)}>
                          <Printer className="mr-2 h-4 w-4" />
                          {t("invoices.print")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("invoices.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">{t("invoices.issueDate")}:</span>
                      <p className="font-medium">{formatDate(invoice.issueDate?.toString()!)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("invoices.dueDate")}:</span>
                      <p className="font-medium">{formatDate(invoice.dueDate?.toString()!)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("invoices.totalMoney")}:</span>
                      <p className="font-medium">{formatCurrency(invoice.total!)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("invoices.paidAmount")}:</span>
                      <p className="font-medium text-green-600">{formatCurrency(invoice.paidAmount!)}</p>
                    </div>
                  </div>

                  {invoice.paidAmount! < invoice.total! && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">{t("invoices.outstandingAmount")}: </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(invoice.total! - invoice.paidAmount!)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {invoices?.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t("invoices.noInvoice")}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || activeFiltersCount > 0
                    ? t("invoices.canNotFilter")
                    : t("invoices.noInvoiceDescription")}
                </p>
                {!searchTerm && activeFiltersCount === 0 && (
                  <Button onClick={() => setShowCreateModal(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("invoices.create")}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t("invoices.pagination.itemsPerPage")}:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    {t("invoices.previous")}
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {t("invoices.page")} {currentPage} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {t("invoices.next")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <InvoiceFormModal
          allUtilities={allUtilities}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateInvoice}
          mode="create"
        />

        <InvoiceFormModal
          allUtilities={allUtilities}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedInvoice(null)
          }}
          onSave={handleEditInvoice}
          invoice={selectedInvoice!}
          mode="edit"
        />

        <InvoiceViewModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedInvoice(null)
          }}
          invoice={selectedInvoice}
          onDownload={handleDownload}
          onSend={handleSend}
          onPrint={handlePrint}
        />

        <InvoiceFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={setFilters}
          currentFilters={filters}
        />

        <InvoiceDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedInvoice(null)
          }}
          onConfirm={handleDeleteInvoice}
          invoice={selectedInvoice}
        />
      </div>
    </ERPLayout>
  )
}
