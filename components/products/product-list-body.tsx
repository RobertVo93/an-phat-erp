import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ImageIcon, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { getProductStatusColor } from "@/lib/utils"
import { Product } from "@/types/product"
import { useRouter } from "next/navigation"
import { ADMIN_ROUTES } from "@/constants/nav"
import { ServersideTable, ServersideTableColumn } from "@/components/common/table/ServersideTable"
import { useLanguage } from "@/contexts/language-context"
import ProductActions from "@/components/products/product-actions"

interface ProductListBodyProps {
    products: Product[]
    totalPages: number
    currentPage: number
    itemsPerPage: number
    total: number
    loading: boolean
    setCurrentPage: (page: number) => void
    handleCreate: () => void
    handleView: (product: Product) => void
    handleEdit: (product: Product) => void
    handleDelete: (product: Product) => void
}

export function ProductListBody({
    products,
    totalPages,
    currentPage,
    itemsPerPage,
    total,
    loading,
    setCurrentPage,
    handleCreate,
    handleView,
    handleEdit,
    handleDelete
}: ProductListBodyProps) {
    const { t } = useLanguage()
    const router = useRouter()

    const onOpenProduct = (productId: string) => {
        router.push(ADMIN_ROUTES.productDetail(productId))
    }

    const ProductImage = ({ product }: { product: Product }) => {
        if (product.image) {
            return (
                <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            )
        } else {
            return (
                <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
            )
        }
    }

    // Define columns for ServersideTable
    const columns: ServersideTableColumn<any>[] = [
        {
            key: "image",
            title: t("products.image"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1 max-w-[120px]">
                    <ProductImage product={row} />
                </div>
            ),
        },
        {
            key: "sku",
            title: "SKU",
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{row.sku}</p>
                </div>
            ),
        },
        {
            key: "name",
            title: t("products.form.name"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{row.name}</p>
                </div>
            ),
        },
        {
            key: "status",
            title: t("products.form.status"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <Badge className={`${getProductStatusColor(row.status!)} text-xs`}>
                        {t(`products.status.${row.status}`)}
                    </Badge>
                </div>
            ),
        },
        {
            key: "unit",
            title: t("products.unit"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{t(`products.form.${row.unit}`)}</p>
                </div>
            ),
        },
        {
            key: "price",
            title: t("products.form.price"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{formatCurrency(row.price)}</p>
                </div>
            ),
        },
        {
            key: "cost",
            title: t("products.form.cost"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{formatCurrency(row.cost)}</p>
                </div>
            ),
        },
        {
            key: "stock",
            title: t("products.stock"),
            sortable: true,
            render: (row) => (
                <div className="space-y-1">
                    <p className="text-sm font-medium">{row.stock}</p>
                </div>
            ),
        },
        {
            key: "actions",
            title: t("common.actions"),
            sortable: false,
            render: (row) => (
                <div className="space-y-1">
                    <ProductActions
                        product={row}
                        handleView={handleView}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                </div>
            ),
        },
    ]

    return (
        <>
            {products.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">{t("products.noProducts")}</p>
                    <Button onClick={handleCreate} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("products.addFirstProduct")}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="hidden lg:block">
                        <ServersideTable
                            columns={columns}
                            data={products}
                            total={total}
                            currentPage={currentPage}
                            pageSize={itemsPerPage}
                            sortBy={""}
                            sortOrder={"desc"}
                            onPageChange={setCurrentPage}
                            onSort={() => { }}
                            loading={loading}
                            totalPages={totalPages}
                            onRecordClick={onOpenProduct}
                        />
                    </div>
                    <div className="lg:hidden space-y-1">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onOpenProduct(product.id!)}
                            >
                                <div className="flex gap-4">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <ProductImage product={product} />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        {/* Header Row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm sm:text-base truncate">{product.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <Badge className={`${getProductStatusColor(product.status!)} text-xs`}>
                                                    {t(`products.status.${product.status}`)}
                                                </Badge>
                                                <ProductActions
                                                    product={product}
                                                    handleView={handleView}
                                                    handleEdit={handleEdit}
                                                    handleDelete={handleDelete}
                                                />
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-muted-foreground">
                                            <div>
                                                <span className="font-medium">SKU:</span>
                                                <div className="truncate">{product.sku}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.stock")}:</span>
                                                <div>{product.stock}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.unit")}:</span>
                                                <div>{t(`products.form.${product.unit}`)}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.form.price")}:</span>
                                                <div className="font-medium text-foreground">{formatCurrency(product.price!)}</div>
                                            </div>
                                            <div>
                                                <span className="font-medium">{t("products.form.cost")}:</span>
                                                <div>{formatCurrency(product.cost!)}</div>
                                            </div>
                                        </div>

                                        {/* Supplier Info */}
                                        {product.supplier && (
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-medium">{t("products.form.supplier")}:</span> {product.supplier}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6 lg:hidden">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-1">{t("products.pagination.previous")}</span>
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page: number
                            if (totalPages <= 5) {
                                page = i + 1
                            } else if (currentPage <= 3) {
                                page = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i
                            } else {
                                page = currentPage - 2 + i
                            }

                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-8 h-8 p-0 text-xs"
                                >
                                    {page}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2"
                    >
                        <span className="hidden sm:inline mr-1">{t("products.pagination.next")}</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </>
    )
}