"use client"

import { useState } from "react"
import { ERPLayout } from "@/components/erp-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

import { useCustomers } from "@/hooks/use-customers"
import { CustomerFormModal } from "@/components/customers/customer-form-modal"
import { CustomerViewModal } from "@/components/customers/customer-view-modal"
import { CustomerDeleteModal } from "@/components/customers/customer-delete-modal"
import { CustomerFilterModal } from "@/components/customers/customer-filter-modal"
import type { Customer } from "@/types/customer"

export default function CustomersPage() {
  const { t } = useLanguage()
  const {
    customers,
    allCustomers,
    filteredCustomers,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
  } = useCustomers()

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "VIP":
        return "bg-purple-100 text-purple-800"
      case "Premium":
        return "bg-blue-100 text-blue-800"
      case "Regular":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const translateStatus = (status: string) => {
    switch (status) {
      case "Active":
        return t("customers.status.active")
      case "Inactive":
        return t("customers.status.inactive")
      case "Pending":
        return t("customers.status.pending")
      default:
        return status
    }
  }

  const translateCustomerType = (type: string) => {
    switch (type) {
      case "VIP":
        return t("customers.type.vip")
      case "Premium":
        return t("customers.type.premium")
      case "Regular":
        return t("customers.type.regular")
      default:
        return type
    }
  }

  const handleCreateCustomer = () => {
    setFormMode("create")
    setSelectedCustomer(null)
    setIsFormModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setFormMode("edit")
    setSelectedCustomer(customer)
    setIsFormModalOpen(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsViewModalOpen(true)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteModalOpen(true)
  }

  const handleSaveCustomer = (customerData: Omit<Customer, "id"> | Customer) => {
    if (formMode === "create") {
      addCustomer(customerData as Omit<Customer, "id">)
    } else if (formMode === "edit" && selectedCustomer) {
      updateCustomer(selectedCustomer.id, customerData)
    }
  }

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomer(selectedCustomer.id)
      setIsDeleteModalOpen(false)
      setSelectedCustomer(null)
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalCustomers)

  // Smart pagination for mobile
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <ERPLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header Section - Responsive */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("customers.title")}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t("customers.description")}</p>
          </div>
          <Button onClick={handleCreateCustomer} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:hidden">Thêm</span>
            <span className="hidden md:inline">{t("customers.addCustomer")}</span>
          </Button>
        </div>

        {/* Search and Filter - Responsive */}
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("customers.searchPlaceholder")}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="w-full md:w-auto">
            <Filter className="mr-2 h-4 w-4" />
            <span className="md:hidden">Lọc</span>
            <span className="hidden md:inline">{t("customers.filter")}</span>
          </Button>
        </div>

        {/* Statistics Cards - Mobile 2x2 Grid */}
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
                {allCustomers.filter((c) => c.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("customers.currentlyActive")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{t("customers.totalRevenue")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-2xl font-bold">$18,160</div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("customers.fromAllCustomers")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">{t("customers.vipCustomers")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl md:text-2xl font-bold">
                {allCustomers.filter((c) => c.customerType === "VIP").length}
              </div>
              <p className="text-xs text-muted-foreground hidden md:block">{t("customers.premiumTierCustomers")}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl">{t("customers.customerDirectory")}</CardTitle>
                <CardDescription className="hidden md:block">
                  {t("customers.customerDirectoryDescription")}
                </CardDescription>
              </div>
              <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-2">
                <span className="text-xs md:text-sm text-muted-foreground">
                  {startIndex}-{endIndex} / {totalCustomers}
                </span>
                <div className="flex items-center space-x-2">
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-16 md:w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-muted-foreground">/trang</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {customers.map((customer) => (
                <div key={customer.id} className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg" alt={customer.name} />
                      <AvatarFallback className="text-xs">{getInitials(customer.name)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header Row */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{customer.name}</h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                              {translateStatus(customer.status)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCustomerTypeColor(customer.customerType)}`}
                            >
                              {translateCustomerType(customer.customerType)}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCustomer(customer)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                          <span className="text-muted-foreground">Đơn hàng:</span>
                          <span className="ml-1 font-medium">{customer.totalOrders}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Chi tiêu:</span>
                          <span className="ml-1 font-medium text-green-600">{customer.totalSpent}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <span className="text-muted-foreground">Đơn cuối:</span>
                          <span className="ml-1">{customer.lastOrder}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <span className="text-muted-foreground">Tham gia:</span>
                          <span className="ml-1">{customer.joinDate}</span>
                        </div>
                      </div>

                      {/* Company Info */}
                      {customer.company && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Công ty:</span> {customer.company}
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
                  <span className="md:hidden">Trước</span>
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
                  <span className="md:hidden">Sau</span>
                  <span className="hidden md:inline">{t("customers.pagination.next")}</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CustomerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        mode={formMode}
      />

      <CustomerViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        customer={selectedCustomer}
      />

      <CustomerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        customer={selectedCustomer}
      />

      <CustomerFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
        currentFilters={filters}
      />
    </ERPLayout>
  )
}
