import React, { useEffect, useState, useCallback } from "react"
import { Search, Plus, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { Customer, CustomerStatus } from "@/types"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { getCustomers } from "@/lib/httpclient/customer.client"

interface CustomerSelectorProps {
	selectedCustomer: Customer | undefined
	onCustomerSelect: (customer: Customer | undefined) => void
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
	selectedCustomer,
	onCustomerSelect,
}) => {
	const { t } = useLanguage()
	const [customers, setCustomers] = useState<Customer[]>([])
	const [customerSearch, setCustomerSearch] = useState("")
	const [showCustomerList, setShowCustomerList] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalCustomers, setTotalCustomers] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [loading, setLoading] = useState(false)
	const debouncedCustomerSearchTerm = useDebounceSearchTerm(customerSearch, 500)

	const handleCustomerSelect = (customer: Customer | undefined) => {
		onCustomerSelect(customer)
		setCustomerSearch(customer?.name || "")
		setShowCustomerList(false)
	}

	const fetchCustomers = async (searchTerm: string, page: number = 1, append: boolean = false) => {
		if (loading) return
		
		setLoading(true)
		try {
			const res = await getCustomers({
				status: CustomerStatus.active,
				searchTerm: searchTerm,
				page: page,
				limit: 10,
				sortBy: "name",
				sortOrder: "asc",
			})
			
			if (append) {
				setCustomers(prev => [...prev, ...res.data])
			} else {
				setCustomers(res.data)
			}
			
			setTotalCustomers(res.total)
			setHasMore((append ? customers.length : 0) + res.data.length < res.total)
		} catch (error) {
			console.error("Failed to fetch customers:", error)
		} finally {
			setLoading(false)
		}
	}

	const loadMoreCustomers = useCallback(() => {
		if (hasMore && !loading) {
			const nextPage = currentPage + 1
			setCurrentPage(nextPage)
			fetchCustomers(debouncedCustomerSearchTerm, nextPage, true)
		}
	}, [hasMore, loading, currentPage, debouncedCustomerSearchTerm])

	useEffect(() => {
		// Reset pagination when search term changes
		setCurrentPage(1)
		setHasMore(true)
		fetchCustomers(debouncedCustomerSearchTerm, 1, false)
	}, [debouncedCustomerSearchTerm])


	return (
		<div className="space-y-2">
			<Label htmlFor="customer">{t("orders.customer")} *</Label>
			<div className="relative">
				<div className="flex space-x-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder={t("orders.searchCustomers")}
							value={customerSearch}
							onChange={e => {
								setCustomerSearch(e.target.value)
								setShowCustomerList(e.target.value.length > 0)
							}}
							className="pl-10"
						/>
					</div>
					<Button type="button" variant="outline" onClick={() => setShowCustomerList(!showCustomerList)}>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
				{showCustomerList && (
					<div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
						{customers.length > 0 ? (
							<>
								{customers.map((customer) => (
									<div
										key={customer.id}
										className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
										onClick={() => handleCustomerSelect(customer)}
									>
										<div className="flex justify-between items-start">
											<div>
												<p className="font-medium">{customer.name}</p>
												<p className="text-sm text-gray-500">{customer.number}</p>
												<p className="text-xs text-gray-400">{customer.email}</p>
											</div>
											{customer.phone && <Badge variant="outline">{customer.phone}</Badge>}
										</div>
									</div>
								))}
								
								{/* Load More Button */}
								{hasMore && (
									<div className="p-3 border-t">
										<Button
											type="button"
											variant="outline"
											className="w-full"
											onClick={loadMoreCustomers}
											disabled={loading}
										>
											{loading ? (
												<>
													<Loader2 className="h-4 w-4 animate-spin mr-2" />
													{t("common.loadingMore")}
												</>
											) : (
												`${t("common.loadMore")} (${totalCustomers - customers.length} ${t("common.remaining")})`
											)}
										</Button>
									</div>
								)}
								
								{/* Show total count when not loading and no more to load */}
								{!hasMore && customers.length > 0 && !loading && (
									<div className="p-2 text-center text-xs text-gray-400 border-t">
										{t("common.showingAll")} {totalCustomers} {t("customers.title")}
									</div>
								)}
							</>
						) : (
							<div className="p-3 text-center text-gray-500">
								{loading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
										<p>{t("common.searching")}...</p>
									</>
								) : (
									t("orders.noCustomersFound")
								)}
							</div>
						)}
					</div>
				)}
			</div>
			{selectedCustomer && (
				<div className="p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium">{selectedCustomer.name}</p>
							<p className="text-sm text-gray-500">{selectedCustomer.company}</p>
							<p className="text-xs text-gray-400">
								{selectedCustomer.email} • {selectedCustomer.phone}
							</p>
						</div>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleCustomerSelect(undefined)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
