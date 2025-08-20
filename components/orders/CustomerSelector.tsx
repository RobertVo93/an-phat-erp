import React, { useMemo, useState } from "react"
import { Search, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { Customer } from "@/types"

interface CustomerSelectorProps {
	customers: Customer[]
	selectedCustomer: Customer | undefined
	onCustomerSelect: (customer: Customer | undefined) => void
}

export const CustomerSelector: React.FC<CustomerSelectorProps> = ({
	customers,
	selectedCustomer,
	onCustomerSelect,
}) => {
	const { t } = useLanguage()
	const [customerSearch, setCustomerSearch] = useState("")
	const [showCustomerList, setShowCustomerList] = useState(false)
	const filteredCustomers = useMemo(() => customers.filter(
		(customer) =>
			customer.name?.toLowerCase().includes(customerSearch?.toLowerCase()) ||
			customer.email?.toLowerCase().includes(customerSearch?.toLowerCase()) ||
			customer.company?.toLowerCase().includes(customerSearch?.toLowerCase()),
	), [customers, customerSearch])

	const handleCustomerSelect = (customer: Customer | undefined) => {
		onCustomerSelect(customer)
		setCustomerSearch(customer?.name || "")
		setShowCustomerList(false)
	}

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
						{filteredCustomers.length > 0 ? (
							filteredCustomers.map((customer) => (
								<div
									key={customer.id}
									className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
									onClick={() => handleCustomerSelect(customer)}
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-medium">{customer.name}</p>
											<p className="text-sm text-gray-500">{customer.company}</p>
											<p className="text-xs text-gray-400">{customer.email}</p>
										</div>
										{customer.phone && <Badge variant="outline">{customer.phone}</Badge>}
									</div>
								</div>
							))
						) : (
							<div className="p-3 text-center text-gray-500">{t("orders.noCustomersFound")}</div>
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
