import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import React, { useMemo, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { groupWarehouseProductsByProduct } from "@/lib/utils"
import { OrderItem, Product, WarehouseProduct } from "@/types"

interface ProductSelectorProps {
	orderItems: OrderItem[]
	products: WarehouseProduct[]
	addProduct: (product: any) => void
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
	orderItems,
	products,
	addProduct,
}) => {
	const { t } = useLanguage()
	const [productSearch, setProductSearch] = useState("")
	const [showProductList, setShowProductList] = useState(false)

	const filteredProducts = useMemo(() => products
		? groupWarehouseProductsByProduct(products)
			.filter(product =>
				!orderItems.some(item => item.product?.id === product.product.id)
				&& product.product.name?.toLowerCase().includes(productSearch.toLowerCase())
				&& product.totalQuantity > 0
			)
		: [], [products, orderItems, productSearch])

	const handleAddProduct = (product: Product) => {
		addProduct(product)
		setProductSearch("")
		setShowProductList(false)
	}

	return (
		<div className="relative">
			<div className="flex space-x-2 pb-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input
						placeholder={t("orders.searchProductsToAdd")}
						value={productSearch}
						onChange={e => {
							setProductSearch(e.target.value)
							setShowProductList(e.target.value.length > 0)
						}}
						className="pl-10"
					/>
				</div>
				<Button type="button" variant="outline" onClick={() => setShowProductList(!showProductList)}>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			{showProductList && (
				<div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
					{filteredProducts.length > 0 ? (
						filteredProducts.map((product, index) => (
							<div
								key={index}
								className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${product.product.stock === 0 && 'pointer-events-none bg-gray-300'}`}
								onClick={() => handleAddProduct(product.product)}
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
						))
					) : (
						<div className="p-3 text-center text-gray-500">{t("orders.noProductsFound")}</div>
					)}
				</div>
			)}
		</div>
	)
}
