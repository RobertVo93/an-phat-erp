import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Loader2 } from "lucide-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { IOrderItem, Product, ProductStatus, WarehouseProduct } from "@/types"
import { useDebounceSearchTerm } from "@/lib/utils.client"
import { toast } from "@/hooks/use-toast"
import { getProductInWarehouseByFiltersClient } from "@/lib/httpclient/warehouse.client"
import { groupWarehouseProductsByProduct } from "@/lib/utils"

interface OrderItemSelectorProps {
	warehouseId: string
	selectedRecords: IOrderItem[]
	onRecordSelect: (orderItem: IOrderItem) => void
}

export const OrderItemSelector: React.FC<OrderItemSelectorProps> = ({
	warehouseId,
	selectedRecords,
	onRecordSelect,
}) => {
	const { t } = useLanguage()
	const [records, setRecords] = useState<WarehouseProduct[]>([])
	const [searchTerm, setSearchTerm] = useState("")
	const [showList, setShowList] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalRecords, setTotalRecords] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [loading, setLoading] = useState(false)
	const debouncedSearchTerm = useDebounceSearchTerm(searchTerm, 500)

	const filteredRecords = useMemo(() => records
		? groupWarehouseProductsByProduct(records)
			.filter(product =>
				!selectedRecords.some(item => item.id === product.product.id)
				&& product.totalQuantity > 0
			)
		: [], [records, selectedRecords])

	const handleAddRecord = (product: Product) => {
		onRecordSelect({
			id: product.id,
			name: product.name,
			number: product.sku,
			quantity: 1,
			unitCost: product.price,
			totalCost: product.price,
			unit: product.unit,
		})
		setSearchTerm("")
		setShowList(false)
	}

	const fetchRecords = async (warehouseId: string, searchTerm: string, page: number = 1, append: boolean = false) => {
		if (loading) return

		setLoading(true)
		try {
			const res = await getProductInWarehouseByFiltersClient({
				status: ProductStatus.active,
				searchTerm: searchTerm,
				warehouseId: warehouseId,
				page: page,
				limit: 10,
				sortBy: "name",
				sortOrder: "asc",
			})

			if (append) {
				setRecords(prev => [...prev, ...res.data])
			} else {
				setRecords(res.data)
			}

			setTotalRecords(res.total - selectedRecords.length)
			setHasMore((append ? records.length : 0) + res.data.length < res.total)
		} catch (error) {
			console.error("Failed to fetch records:", error)
			toast({
				title: t("common.error.title"),
				description: t("common.error.cannotLoad"),
				variant: "destructive",
			})
		} finally {
			setLoading(false)
		}
	}

	const loadMoreCustomers = useCallback(() => {
		if (hasMore && !loading) {
			const nextPage = currentPage + 1
			setCurrentPage(nextPage)
			fetchRecords(warehouseId, debouncedSearchTerm, nextPage, true)
		}
	}, [hasMore, loading, currentPage, debouncedSearchTerm, warehouseId])

	useEffect(() => {
		// Reset pagination when search term changes
		setCurrentPage(1)
		setHasMore(true)
		fetchRecords(warehouseId, debouncedSearchTerm, 1, false)
	}, [debouncedSearchTerm, warehouseId])

	return (
		<div className="relative">
			<div className="flex space-x-2 pb-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder={t("orders.searchProductsToAdd")}
						value={searchTerm}
						onChange={e => {
							setSearchTerm(e.target.value)
							setShowList(e.target.value.length > 0)
						}}
						className="pl-10"
					/>
				</div>
				<Button type="button" variant="outline" onClick={() => setShowList(prev => !prev)}>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			{showList && (
				<div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{filteredRecords.length > 0 ? (
						<>
							{filteredRecords.map((product, index) => (
								<div
									key={index}
									className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${product.product.stock === 0 && 'pointer-events-none bg-gray-300'}`}
									onClick={() => handleAddRecord(product.product)}
								>
									<div className="flex justify-between items-center">
										<div>
											<p className="font-medium">{product.product.name}</p>
											<p className="text-sm text-gray-500">
												{product.product.price} • {t("orders.modal.productStock")}: {product.totalQuantity}
											</p>
										</div>
										<Badge variant="outline">{product.product.sku}</Badge>
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
											`${t("common.loadMore")} (${totalRecords - filteredRecords.length} ${t("common.remaining")})`
										)}
									</Button>
								</div>
							)}

							{/* Show total count when not loading and no more to load */}
							{!hasMore && filteredRecords.length > 0 && !loading && (
								<div className="p-2 text-center text-xs text-gray-400 border-t">
									{t("common.showingAll")} {totalRecords} {t("common.records")}
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
								t("orders.noProductsFound")
							)}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
